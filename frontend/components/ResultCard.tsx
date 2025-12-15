/* ========================================
   FILE: ResultCard.tsx (Optional Component)
   ======================================== */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function ResultCard({ result }: { result: any }) {
  return (
    <Card className="glass-card hover-glow">
      <CardHeader className="gradient-header">
        <CardTitle className="text-white text-xl">
          Classification Result
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        {!result && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Check className="w-12 h-12 text-blue-400" />
            </div>
            <p className="text-blue-300 text-lg font-medium">
              Upload an image and click <span className="text-white font-bold">Check</span>
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-5">
            {/* Cattle Type */}
            <div className="result-box">
              <p className="text-sm text-blue-400 mb-2 font-semibold uppercase tracking-wide">
                Cattle Type
              </p>
              <p className="text-3xl font-bold text-white mb-2">
                {result.type.toUpperCase()}
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-blue-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                    style={{ width: `${result.type_confidence * 100}%` }}
                  />
                </div>
                <span className="text-green-400 font-bold text-sm">
                  {(result.type_confidence * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            {/* None Type Warning */}
            {result.type === "none" && (
              <div className="warning-box">
                <p className="text-red-300 font-semibold flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  The image is not of cattle
                </p>
              </div>
            )}

            {/* Breed Info */}
            {result.type !== "none" && result.breed && (
              <>
                <div className="result-box">
                  <p className="text-sm text-blue-400 mb-2 font-semibold uppercase tracking-wide">
                    Breed
                  </p>
                  <p className="text-2xl font-bold text-white mb-2">
                    {result.breed}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 bg-blue-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                        style={{ width: `${result.breed_confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-blue-400 font-bold text-sm">
                      {(result.breed_confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                {result.breed_confidence < 0.6 && (
                  <div className="warning-box-amber">
                    <p className="text-amber-300 text-sm font-medium flex items-center gap-2">
                      <span className="text-xl">⚠️</span>
                      Low confidence due to limited training data
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}