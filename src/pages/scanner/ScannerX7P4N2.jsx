import { useEffect, useMemo, useRef, useState } from "react";
import jsQR from "jsqr";
import RegisteredSuccessBanner from "../../components/Registration/RegisteredSuccessBanner";

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
  const [searchMode, setSearchMode] = useState("qr"); // "qr" | "token"
  const [manualToken, setManualToken] = useState("");

  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);

  const [actionLoading, setActionLoading] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [successBanner, setSuccessBanner] = useState(null);

  const [isMirrored, setIsMirrored] = useState(false);

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
    setManualToken("");
    setSearchMode("qr");
    setScanning(false);
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
        token: cleanToken.toUpperCase(),
      });

      setLookupResult(data);
    } catch (e) {
      setError(e?.message || "Lookup failed.");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleManualLookup = async () => {
    const raw = String(manualToken ?? "").trim();
    if (!raw) {
      setError("Enter a token to search.");
      return;
    }

    const cleanToken = normalizeToken(raw);
    if (!cleanToken) {
      setError("Enter a token to search.");
      return;
    }

    setToken(cleanToken);
    setScanning(false);
    setLookupResult(null);
    setConfirmation("");
    setError("");
    await lookupToken(raw);
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

      const row = data?.row || lookupResult?.row;
      const name =
        row?.fullName ||
        row?.name ||
        row?.Name ||
        row?.["Full Name"] ||
        row?.["full name"] ||
        "Participant";
      const checkedFor = type === "attendance" ? "present" : type;

      const successMessage =
        data.message || `${name} checked in for ${checkedFor}.`;
      setConfirmation(successMessage);
      setSuccessBanner({ name, checkedFor, message: successMessage });

      setTimeout(() => {
        resetToScanner();
        setSuccessBanner(null);
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

        const videoTrack = stream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();
        
        // If facingMode is 'user', it's a front/laptop cam. 
        // If facingMode isn't supported, we can fallback to checking label for "front"
        const isFrontCam = settings.facingMode === 'user' || (settings.label && settings.label.toLowerCase().includes('front')) || (settings.label && settings.label.toLowerCase().includes('webcam'));
        
        setIsMirrored(isFrontCam);

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

    if (searchMode === "qr") {
      start();
    } else {
      setScanning(false);
      stopCamera();
    }

    return () => {
      cancelled = true;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      stopCamera();
    };
  }, [scanSession, constraints, searchMode]);

  const renderRowDetails = () => {
    const row = lookupResult?.row;
    if (!row) return null;
  
    const getColumnValue = (...keys) => {
      for (const key of keys) {
        if (!key) continue;
  
        if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
          return row[key];
        }
  
        const lowerKey = String(key).toLowerCase();
        const upperKey = String(key).toUpperCase();
  
        if (
          row[lowerKey] !== undefined &&
          row[lowerKey] !== null &&
          row[lowerKey] !== ""
        ) {
          return row[lowerKey];
        }
  
        if (
          row[upperKey] !== undefined &&
          row[upperKey] !== null &&
          row[upperKey] !== ""
        ) {
          return row[upperKey];
        }
      }
  
      return "";
    };
  
    const parseBool = (value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "number") return value !== 0;
      if (typeof value === "string") {
        const t = value.trim().toLowerCase();
        return t === "true" || t === "yes" || t === "1";
      }
      return false;
    };
  
    // Your main summary fields
    const studentEmail = getColumnValue("A", "Student email", "Email", "email");
    const fullName = getColumnValue("B", "Full Name", "Name", "fullName", "name");
    const school = getColumnValue("C", "School", "school");
    const rsvp = getColumnValue("D", "RSVP", "rsvp");
    const attendance = parseBool(getColumnValue("E", "Attendance", "attendance"));
    const lunch = parseBool(getColumnValue("F", "Lunch", "lunch"));
    const dinner = parseBool(getColumnValue("G", "Dinner", "dinner"));
    const dietary = getColumnValue(
      "H",
      "Dietary Restrictions",
      "Dietary",
      "dietary",
      "dietaryRestrictions",
    );
    const arduino = parseBool(getColumnValue("I", "Arduino", "arduino"));
  
    return (
      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3">
          <div className="text-lg font-bold">Match found</div>
        </div>
  
        {/* Main operator summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {[
            ["Student email", studentEmail],
            ["Full name", fullName],
            ["School", school],
            ["RSVP", rsvp],
            ["Attendance", attendance ? "Yes" : "No"],
            ["Lunch", lunch ? "Yes" : "No"],
            ["Lunch", lunch ? "Yes" : "No"],
            ["Dinner", dinner ? "Yes" : "No"],
            ["Dietary restrictions", dietary],
            ["Arduino", arduino ? "Yes" : "No"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-black/20 p-3"
            >
              <div className="text-xs uppercase tracking-wide text-white/50">
                {label}
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
            disabled={!!actionLoading || attendance}
            onClick={() => handleAction("attendance")}
            className={`px-4 py-2 rounded-lg font-bold ${
              attendance
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            {actionLoading === "attendance" ? "Saving..." : "Attendance"}
          </button>
  
          <button
            type="button"
            disabled={!!actionLoading || lunch}
            onClick={() => handleAction("lunch")}
            className={`px-4 py-2 rounded-lg font-bold ${
              lunch
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-amber-600 text-white hover:bg-amber-500"
            }`}
          >
            {actionLoading === "lunch" ? "Saving..." : "Lunch"}
          </button>
  
          <button
            type="button"
            disabled={!!actionLoading || dinner}
            onClick={() => handleAction("dinner")}
            className={`px-4 py-2 rounded-lg font-bold ${
              dinner
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
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
            <div className="flex w-full justify-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setSearchMode("qr");
                  setError("");
                  setScanning(false);
                }}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  searchMode === "qr"
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                Scan QR
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchMode("token");
                  setError("");
                  setScanning(false);
                }}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  searchMode === "token"
                    ? "bg-emerald-600 text-white"
                    : "bg-white/5 text-white/80 hover:bg-white/10"
                }`}
              >
                Search by token
              </button>
            </div>

            {error ? (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-white/90">
                <div className="font-bold mb-2">Error</div>
                <div className="text-sm text-white/70 mb-4">{error}</div>
                <button
                  type="button"
                  onClick={() => {
                    if (searchMode === "qr") {
                      setScanSession((s) => s + 1);
                    } else {
                      handleManualLookup();
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-white text-black font-bold hover:bg-white/90"
                >
                  Retry
                </button>
              </div>
            ) : searchMode === "qr" ? (
              <>
                <div className="flex flex-col gap-3 items-center text-center mb-4">
                  <div className="text-2xl font-bold">Scan QR code</div>
                  <div className="text-sm text-white/70">
                    Point your camera at a QR code.
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-black/30 border border-white/10">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    style={{
                      transform: isMirrored ? "scaleX(-1)" : "none",
                    }}
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
              </>
            ) : (
              <div className="rounded-2xl overflow-hidden bg-black/30 border border-white/10 p-5">
                <div className="flex flex-col gap-2 items-center text-center mb-4">
                  <div className="text-2xl font-bold">Search by token</div>
                  <div className="text-sm text-white/70">
                    Paste a token or QR URL, then click Lookup.
                  </div>
                </div>

                <input
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleManualLookup();
                  }}
                  placeholder="Paste token or link"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />

                <button
                  type="button"
                  onClick={handleManualLookup}
                  disabled={lookupLoading}
                  className="mt-4 w-full px-4 py-3 rounded-lg bg-white text-black font-bold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {lookupLoading ? "Looking up..." : "Lookup"}
                </button>
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

        {successBanner ? (
          <RegisteredSuccessBanner
            name={successBanner.name}
            checkedFor={successBanner.checkedFor}
            message={successBanner.message}
            onDismiss={() => setSuccessBanner(null)}
          />
        ) : null}

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
