/* ========================================
   FILE: BreedInfoCard.tsx (Optional Component)
   ======================================== */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BreedInfo = {
  name: string;
  milk_production: string;
  origin: string;
  horn_type: string;
  body_features: string;
  best_food: string;
};

export default function BreedInfoCard({ breedInfo }: { breedInfo?: BreedInfo | null }) {
  if (!breedInfo) return null;

  return (
    <Card className="glass-card hover-glow">
      <CardHeader className="gradient-header">
        <CardTitle className="text-white text-xl">
          📋 Breed Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="info-box">
            <p className="text-sm text-blue-400 mb-1 font-semibold">Name</p>
            <p className="text-white font-medium text-lg">{breedInfo.name}</p>
          </div>
          <div className="info-box">
            <p className="text-sm text-blue-400 mb-1 font-semibold">Milk Production</p>
            <p className="text-white font-medium text-lg">{breedInfo.milk_production}</p>
          </div>
          <div className="info-box">
            <p className="text-sm text-blue-400 mb-1 font-semibold">Origin</p>
            <p className="text-white font-medium text-lg">{breedInfo.origin}</p>
          </div>
          <div className="info-box">
            <p className="text-sm text-blue-400 mb-1 font-semibold">Horn Type</p>
            <p className="text-white font-medium text-lg">{breedInfo.horn_type}</p>
          </div>
          <div className="info-box md:col-span-2">
            <p className="text-sm text-blue-400 mb-1 font-semibold">Body Features</p>
            <p className="text-white font-medium text-lg">{breedInfo.body_features}</p>
          </div>
          <div className="info-box md:col-span-2">
            <p className="text-sm text-blue-400 mb-1 font-semibold">Best Food</p>
            <p className="text-white font-medium text-lg">{breedInfo.best_food}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}