/* ========================================
   FILE: page.tsx (FIXED BUTTONS & DESIGN)
   ======================================== */

"use client";

import { useState, useEffect } from "react";
import breedInfoData from "@/data/breedInfo.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, RotateCcw, Check, ImageIcon, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

/* ================= TYPES ================= */

type ApiResult = {
  type: "cow" | "buffalo" | "none";
  type_confidence: number;
  breed?: string;
  breed_confidence?: number;
};

type BreedInfo = {
  name: string;
  milk_production: string;
  origin: string;
  horn_type: string;
  body_features: string;
  best_food: string;
};

/* ================= COMPONENT ================= */

export default function HomePage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [pageLoaded, setPageLoaded] = useState(false);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* ---------- Image Select ---------- */
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image");
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("Image must be under 1MB");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const objectUrl = URL.createObjectURL(file);
    setImage(file);
    setPreview(objectUrl);
    setResult(null);
  }

  /* ---------- API Call ---------- */
  async function handleCheck() {
    if (!image) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", image);

      const res = await fetch("http://localhost:8000/classify", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Prediction failed");

      const data: ApiResult = await res.json();
      setResult(data);
      toast.success("Classification completed!");
    } catch (err) {
      toast.error("Backend error. Is FastAPI running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* ---------- Reset ---------- */
  function handleReset() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview("");
    setResult(null);
  }

  const breedInfo: BreedInfo | null =
    result?.breed && breedInfoData[result.breed as keyof typeof breedInfoData]
      ? breedInfoData[result.breed as keyof typeof breedInfoData]
      : null;

  /* ================= RENDER ================= */

  return (
    <>
      {/* ========== PROFESSIONAL HEADER SECTION ========== */}
      <header className="header-section">
        <div className="header-content">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-7 h-7 text-yellow-400 animate-pulse" />
            <h1 className="main-title">NandiVision</h1>
            <Sparkles className="w-7 h-7 text-yellow-400 animate-pulse" />
          </div>
          <p className="subtitle">Smart AI Cattle Classifier</p>
          <div className="title-underline"></div>
        </div>
      </header>

      {/* ========== MAIN CONTENT SECTION ========== */}
      <main className="main-section">
        <div className={`content-container ${pageLoaded ? 'loaded' : ''}`}>
          
          {/* ========== 50/50 GRID LAYOUT ========== */}
          <div className="cards-grid">
            
            {/* ========== LEFT: UPLOAD CARD ========== */}
            <Card className="main-card upload-card">
              <CardHeader className="card-header">
                <CardTitle className="card-title">
                  <Upload className="w-5 h-5" />
                  Upload Cattle Image
                </CardTitle>
              </CardHeader>

              <CardContent className="card-body">
                {/* Image Preview Zone */}
                <div className="upload-zone">
                  {preview ? (
                    <div className="image-preview">
                      <img
                        src={preview}
                        alt="Preview"
                        className="preview-image"
                      />
                    </div>
                  ) : (
                    <div className="empty-state">
                      <div className="icon-wrapper">
                        <ImageIcon className="w-16 h-16 text-blue-400 animate-float" />
                      </div>
                      <p className="empty-title">Drop your cattle image here</p>
                      <p className="empty-subtitle">or click Upload button below</p>
                      <p className="empty-info">PNG, JPG • Max 1MB</p>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="file-upload"
                />

                {/* Action Buttons - WORKING */}
                <div className="button-grid">
                  <label htmlFor="file-upload" className="action-btn btn-blue">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </label>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleReset();
                    }}
                    disabled={!image}
                    className="action-btn btn-orange"
                    type="button"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleCheck();
                    }}
                    disabled={!image || loading}
                    className="action-btn btn-green"
                    type="button"
                  >
                    <Check className="w-4 h-4" />
                    <span>{loading ? "Wait..." : "Check"}</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* ========== RIGHT: RESULT CARD ========== */}
            <Card className="main-card result-card">
              <CardHeader className="card-header">
                <CardTitle className="card-title">
                  <Sparkles className="w-5 h-5" />
                  Classification Result
                </CardTitle>
              </CardHeader>

              <CardContent className="card-body">
                {!result ? (
                  <div className="waiting-state">
                    <div className="waiting-icon">
                      <Check className="w-10 h-10 text-blue-300" />
                    </div>
                    <p className="waiting-title">Waiting for analysis...</p>
                    <p className="waiting-subtitle">Upload an image and click Check</p>
                  </div>
                ) : (
                  <div className="results-container">
                    {/* Cattle Type Result */}
                    <div className="result-box">
                      <div className="result-header">
                        <span className="result-label">Cattle Type</span>
                        <span className="result-badge badge-blue">AI Detected</span>
                      </div>
                      <p className="result-value">{result.type.toUpperCase()}</p>
                      <div className="progress-wrapper">
                        <div className="progress-bar">
                          <div
                            className="progress-fill progress-green"
                            style={{ width: `${result.type_confidence * 100}%` }}
                          />
                        </div>
                        <span className="progress-text text-green">
                          {(result.type_confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* None Warning */}
                    {result.type === "none" && (
                      <div className="warning-box warning-red">
                        <AlertCircle className="w-6 h-6 flex-shrink-0" />
                        <div>
                          <p className="warning-title">Not a Cattle Image</p>
                          <p className="warning-subtitle">The uploaded image is not of cattle</p>
                        </div>
                      </div>
                    )}

                    {/* Breed Result */}
                    {result.type !== "none" && result.breed && (
                      <>
                        <div className="result-box">
                          <div className="result-header">
                            <span className="result-label">Breed Identified</span>
                            <span className="result-badge badge-purple">Classified</span>
                          </div>
                          <p className="result-value">{result.breed}</p>
                          <div className="progress-wrapper">
                            <div className="progress-bar">
                              <div
                                className="progress-fill progress-purple"
                                style={{ width: `${result.breed_confidence! * 100}%` }}
                              />
                            </div>
                            <span className="progress-text text-purple">
                              {(result.breed_confidence! * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {result.breed_confidence! < 0.6 && (
                          <div className="warning-box warning-amber">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="warning-text">Low confidence - Limited training data</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ========== BREED INFORMATION (FULL WIDTH) ========== */}
          {breedInfo && (
            <Card className="main-card info-card">
              <CardHeader className="card-header">
                <CardTitle className="card-title">
                  <span>📋</span>
                  Detailed Breed Information
                </CardTitle>
              </CardHeader>

              <CardContent className="card-body">
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Breed Name</div>
                    <div className="info-value">{breedInfo.name}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">Milk Production</div>
                    <div className="info-value">{breedInfo.milk_production}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">Origin</div>
                    <div className="info-value">{breedInfo.origin}</div>
                  </div>
                  
                  <div className="info-item">
                    <div className="info-label">Horn Type</div>
                    <div className="info-value">{breedInfo.horn_type}</div>
                  </div>
                  
                  <div className="info-item info-item-wide">
                    <div className="info-label">Body Features</div>
                    <div className="info-value">{breedInfo.body_features}</div>
                  </div>
                  
                  <div className="info-item info-item-full">
                    <div className="info-label">Best Food</div>
                    <div className="info-value">{breedInfo.best_food}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}