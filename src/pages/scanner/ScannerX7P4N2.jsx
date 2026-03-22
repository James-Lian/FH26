import { useEffect, useMemo, useRef, useState } from "react";
import jsQR from "jsqr";

export default function ScannerX7P4N2() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanSession, setScanSession] = useState(0);
  const [postResult, setPostResult] = useState(null);

  const videoRef = useRef(null);
  const rafIdRef = useRef(null);
  const streamRef = useRef(null);
  const inFlightRef = useRef(false);
  const detectorRef = useRef(null);

  const constraints = useMemo(
    () => ({
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    }),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const hasBarcodeDetector = "BarcodeDetector" in window;

    async function stopCamera() {
      const stream = streamRef.current;
      streamRef.current = null;

      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }

      const video = videoRef.current;
      if (video) video.srcObject = null;
    }

    async function start() {
      setError("");
      setToken(null);
      setScanning(true);

      if (hasBarcodeDetector) {
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        detectorRef.current = detector;
      } else {
        detectorRef.current = null;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        // Required for iOS to start playback after assigning srcObject.
        await video.play();

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          setError("Could not initialize QR decoder.");
          setScanning(false);
          await stopCamera();
          return;
        }

        const lastDecodeAtRef = { current: 0 };

        const tick = async () => {
          if (cancelled) return;

          const currentVideo = videoRef.current;
          const currentDetector = detectorRef.current;
          const currentStream = streamRef.current;
          if (
            !currentVideo ||
            !currentDetector ||
            !currentStream ||
            currentVideo.readyState < 2
          ) {
            rafIdRef.current = requestAnimationFrame(tick);
            return;
          }

          const { videoWidth: w, videoHeight: h } = currentVideo;
          if (!w || !h) {
            rafIdRef.current = requestAnimationFrame(tick);
            return;
          }

          if (canvas.width !== w) canvas.width = w;
          if (canvas.height !== h) canvas.height = h;

          ctx.drawImage(currentVideo, 0, 0, w, h);

          if (inFlightRef.current) {
            rafIdRef.current = requestAnimationFrame(tick);
            return;
          }

          inFlightRef.current = true;
          try {
            // Throttle decoding on fallback path to keep Safari responsive.
            const throttleMs = hasBarcodeDetector ? 0 : 150;
            const now = Date.now();
            if (
              !hasBarcodeDetector &&
              now - lastDecodeAtRef.current < throttleMs
            ) {
              rafIdRef.current = requestAnimationFrame(tick);
              return;
            }
            lastDecodeAtRef.current = now;

            if (hasBarcodeDetector && currentDetector) {
              const barcodes = await currentDetector.detect(canvas);
              if (!cancelled && barcodes && barcodes.length > 0) {
                const raw = barcodes[0]?.rawValue;
                if (typeof raw === "string" && raw.length > 0) {
                  // Print token to console for quick debugging/logging.
                  console.log("QR token:", raw);
                  setToken(raw);
                  setScanning(false);
                  if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
                  rafIdRef.current = null;
                  await stopCamera();
                  return;
                }
              }
            } else {
              // jsQR fallback: decode from ImageData pixels.
              const imageData = ctx.getImageData(0, 0, w, h);
              const result = jsQR(imageData.data, w, h);
              const raw = result?.data;
              if (typeof raw === "string" && raw.length > 0) {
                console.log("QR token (jsqr):", raw);
                setToken(raw);
                setScanning(false);
                if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
                await stopCamera();
                return;
              }
            }
          } catch {
            // Transient decoder failures can happen while frames are updating.
          } finally {
            inFlightRef.current = false;
          }

          rafIdRef.current = requestAnimationFrame(tick);
        };

        rafIdRef.current = requestAnimationFrame(tick);
      } catch (err) {
        if (cancelled) return;
        const name = err?.name;
        if (name === "NotAllowedError" || name === "PermissionDeniedError") {
          setError("Camera permission denied.");
        } else {
          setError("Unable to access camera.");
        }
        setScanning(false);
        await stopCamera();
      }
    }

    start();

    return () => {
      cancelled = true;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      stopCamera();
    };
  }, [scanSession, constraints]);

  const runGoogleScriptPost = async () => {
    setPostResult(null);
  
    try {
      const body = new URLSearchParams({
        code: "hi",
        timestamp: "bruh",
      });
  
      const r = await fetch(
        "https://script.google.com/a/macros/pdsb.net/s/AKfycbx3DV3Rs0Pq1vSvcrjd4Jc1RiGEUeCidhJTP_cBrYsw4mAAAKfwlnC3CwTuyKrIlgNKSA/exec",
        {
          method: "POST",
          body,
        },
      );
  
      const t = await r.text();
      console.log("Response:", t);
  
      if (r.ok) {
        setPostResult({ ok: true, body: t });
      } else {
        setPostResult({ ok: false, body: t || `HTTP ${r.status}` });
      }
    } catch (e) {
      console.error("Error:", e);
      setPostResult({
        ok: false,
        body: e?.message ?? String(e),
      });
    }
  };

  return (
    <div className="w-screen h-screen relative flex flex-col items-center justify-center text-white p-4">
      <div className="w-full max-w-xl">
        {token ? (
          <div className="flex flex-col gap-3 items-center text-center">
            <div className="text-sm text-white/70">
              QR decoded. Camera stopped.
            </div>
            <pre className="w-full rounded-xl bg-white/5 border border-white/10 p-4 overflow-auto break-all text-left">
              {token}
            </pre>
            <button
              type="button"
              onClick={() => setScanSession((s) => s + 1)}
              className="px-4 py-2 rounded-lg bg-white text-black font-bold hover:bg-white/90 active:bg-white/80"
            >
              Scan another code
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 items-center text-center mb-4">
              <div className="text-lg font-bold">Scan QR code</div>
              <div className="text-sm text-white/70">
                Point your phone camera at a QR code.
              </div>
            </div>

            {error ? (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-white/90">
                <div className="font-bold mb-2">Error</div>
                <div className="text-sm text-white/70 mb-4">{error}</div>
                <button
                  type="button"
                  onClick={() => setScanSession((s) => s + 1)}
                  className="px-4 py-2 rounded-lg bg-white text-black font-bold hover:bg-white/90 active:bg-white/80"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black/30 border border-white/10">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-10/12 max-w-sm h-10/12 max-h-md border-4 border-white/60 rounded-xl shadow-[0_0_0_3px_rgba(255,255,255,0.08)]" />
                </div>
                {scanning && (
                  <div className="absolute left-3 bottom-3 text-xs text-white/70 bg-black/20 rounded-lg px-2 py-1">
                    Scanning…
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={runGoogleScriptPost}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 active:bg-emerald-700"
          >
            Send test POST
          </button>
          {postResult?.ok && (
            <div className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-200">
              <div className="font-semibold text-emerald-100">Posted successfully</div>
              {postResult.body ? (
                <pre className="mt-2 max-h-32 overflow-auto text-left text-xs text-emerald-100/90 whitespace-pre-wrap break-all">
                  {postResult.body}
                </pre>
              ) : null}
            </div>
          )}
          {postResult && !postResult.ok && (
            <div className="w-full rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
              <div className="font-semibold text-red-100">Request failed</div>
              <pre className="mt-2 max-h-32 overflow-auto text-left text-xs text-red-100/90 whitespace-pre-wrap break-all">
                {postResult.body}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
