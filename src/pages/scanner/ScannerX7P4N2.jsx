import { useEffect, useMemo, useRef, useState } from "react";
import jsQR from "jsqr";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyZQw3PSHMlFecEA19IioqNeqf0cNkyWYJW376DhAULWFgROvnUSIIIZOPCW8v5Yjm8dg/exec";

function normalizeToken(raw) {
  const value = String(raw || "").trim();
  if (!value) return "";

  if (!/^https?:\/\//i.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);
    return (
      url.searchParams.get("token") ||
      url.searchParams.get("code") ||
      url.searchParams.get("id") ||
      url.searchParams.get("qr") ||
      url.pathname.split("/").filter(Boolean).pop() ||
      value
    );
  } catch {
    return value;
  }
}

export default function ScannerX7P4N2() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanSession, setScanSession] = useState(0);

  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);

  const [actionLoading, setActionLoading] = useState("");
  const [confirmation, setConfirmation] = useState("");

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

  const resetToScanner = () => {
    setToken(null);
    setLookupResult(null);
    setLookupLoading(false);
    setActionLoading("");
    setConfirmation("");
    setError("");
    setScanSession((s) => s + 1);
  };

  const callAppsScript = async (payload) => {
    const body = new URLSearchParams(payload);

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body,
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(text || `HTTP ${response.status}`);
    }

    if (!response.ok || !data?.ok) {
      throw new Error(data?.message || `HTTP ${response.status}`);
    }

    return data;
  };

  const lookupToken = async (rawToken) => {
    const cleanToken = normalizeToken(rawToken);
    setLookupLoading(true);
    setLookupResult(null);
    setConfirmation("");
    setError("");

    try {
      const data = await callAppsScript({
        action: "find",
        token: cleanToken,
      });

      setLookupResult(data);
    } catch (e) {
      setError(e?.message || "Lookup failed.");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleAction = async (type) => {
    if (!token) return;

    setActionLoading(type);
    setConfirmation("");
    setError("");

    try {
      const data = await callAppsScript({
        action: "update",
        token,
        type,
      });

      setLookupResult(data);
      setConfirmation(data.message || "Updated successfully.");

      setTimeout(() => {
        resetToScanner();
      }, 1800);
    } catch (e) {
      setError(e?.message || "Update failed.");
    } finally {
      setActionLoading("");
    }
  };

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
      setLookupResult(null);
      setConfirmation("");
      setScanning(true);

      if (hasBarcodeDetector) {
        try {
          detectorRef.current = new window.BarcodeDetector({
            formats: ["qr_code"],
          });
        } catch {
          detectorRef.current = null;
        }
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

          if (!currentVideo || !currentStream || currentVideo.readyState < 2) {
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

            let raw = "";

            if (hasBarcodeDetector && currentDetector) {
              const barcodes = await currentDetector.detect(canvas);
              if (barcodes && barcodes.length > 0) {
                raw = String(barcodes[0]?.rawValue || "").trim();
              }
            } else {
              const imageData = ctx.getImageData(0, 0, w, h);
              const result = jsQR(imageData.data, w, h);
              raw = String(result?.data || "").trim();
            }

            if (!cancelled && raw) {
              const cleanToken = normalizeToken(raw);
              console.log("QR raw:", raw);
              console.log("QR token:", cleanToken);

              setToken(cleanToken);
              setScanning(false);

              if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
              rafIdRef.current = null;

              await stopCamera();
              lookupToken(cleanToken);
              return;
            }
          } catch {
            // ignore transient frame errors
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

  const renderRowDetails = () => {
    const row = lookupResult?.row;
    if (!row) return null;

    return (
      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-lg font-bold mb-3">Match found</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {Object.entries(row).map(([key, value]) => (
            <div
              key={key}
              className="rounded-xl border border-white/10 bg-black/20 p-3"
            >
              <div className="text-xs uppercase tracking-wide text-white/50">
                {key}
              </div>
              <div className="mt-1 text-sm break-words">
                {String(value ?? "")}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            disabled={!!actionLoading}
            onClick={() => handleAction("attendance")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 disabled:opacity-50"
          >
            {actionLoading === "attendance" ? "Saving..." : "Attendance"}
          </button>

          <button
            type="button"
            disabled={!!actionLoading}
            onClick={() => handleAction("lunch")}
            className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-500 disabled:opacity-50"
          >
            {actionLoading === "lunch" ? "Saving..." : "Lunch"}
          </button>

          <button
            type="button"
            disabled={!!actionLoading}
            onClick={() => handleAction("dinner")}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 disabled:opacity-50"
          >
            {actionLoading === "dinner" ? "Saving..." : "Dinner"}
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={resetToScanner}
            className="px-4 py-2 rounded-lg bg-white text-black font-bold hover:bg-white/90"
          >
            Back to scanner
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-screen min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {!token && !lookupLoading && !lookupResult ? (
          <>
            <div className="flex flex-col gap-3 items-center text-center mb-4">
              <div className="text-2xl font-bold">Scan QR code</div>
              <div className="text-sm text-white/70">
                Point your camera at a QR code.
              </div>
            </div>

            {error ? (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-white/90">
                <div className="font-bold mb-2">Error</div>
                <div className="text-sm text-white/70 mb-4">{error}</div>
                <button
                  type="button"
                  onClick={() => setScanSession((s) => s + 1)}
                  className="px-4 py-2 rounded-lg bg-white text-black font-bold hover:bg-white/90"
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
                    Scanning...
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}

        {lookupLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="text-lg font-bold">Looking up token...</div>
            <div className="text-sm text-white/70 mt-2">{token}</div>
          </div>
        ) : null}

        {lookupResult ? renderRowDetails() : null}

        {confirmation ? (
          <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-200">
            <div className="font-semibold text-emerald-100">{confirmation}</div>
            <div className="mt-1 text-emerald-100/80">
              Returning to scanner...
            </div>
          </div>
        ) : null}

        {error && token ? (
          <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-sm text-red-200">
            <div className="font-semibold text-red-100">Request failed</div>
            <div className="mt-2 whitespace-pre-wrap break-all">{error}</div>
            <button
              type="button"
              onClick={resetToScanner}
              className="mt-4 px-4 py-2 rounded-lg bg-white text-black font-bold hover:bg-white/90"
            >
              Back to scanner
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
