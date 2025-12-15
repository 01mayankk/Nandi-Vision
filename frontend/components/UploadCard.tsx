/* ========================================
   FILE: UploadCard.tsx (Optional Component)
   ======================================== */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, RotateCcw, Check, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export default function UploadCard({
  onResult,
}: {
  onResult: (data: any | null) => void;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image");
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("Image must be under 1MB (passport size)");
      return;
    }

    setImage(file);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onResult(null);
  }

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

      const data = await res.json();
      onResult(data);
      toast.success("Classification completed");
    } catch (err) {
      toast.error("Backend error. Is FastAPI running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview(null);
    onResult(null);
  }

  return (
    <Card className="glass-card hover-glow">
      <CardHeader className="gradient-header">
        <CardTitle className="flex items-center gap-2 text-white text-xl">
          <Upload className="w-6 h-6" />
          Upload Image
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 space-y-6">
        {/* Preview Area */}
        <div className="upload-zone">
          {preview ? (
            <div className="mx-auto w-full max-w-sm h-72 relative">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain rounded-xl shadow-2xl"
                unoptimized
              />
            </div>
          ) : (
            <div className="text-blue-600 py-16">
              <ImageIcon className="mx-auto w-20 h-20 mb-4 animate-pulse" />
              <p className="font-semibold text-lg">
                Passport size image (≤1MB)
              </p>
              <p className="text-sm text-blue-500 mt-2">
                Click Upload to select an image
              </p>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          id="upload"
        />

        {/* Buttons */}
        <div className="grid grid-cols-3 gap-4">
          {/* Upload Button */}
          <label htmlFor="upload" className="cursor-pointer">
            <Button
              variant="outline"
              className="btn-upload w-full"
              asChild
            >
              <span className="flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Upload
              </span>
            </Button>
          </label>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={handleReset}
            className="btn-reset"
            disabled={!image}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>

          {/* Check Button */}
          <Button
            onClick={handleCheck}
            disabled={!image || loading}
            className="btn-check"
          >
            <Check className="w-5 h-5 mr-2" />
            {loading ? "..." : "Check"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}