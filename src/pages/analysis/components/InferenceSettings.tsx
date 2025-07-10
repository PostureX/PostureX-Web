import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, User, Hand, Eye, Activity, Settings, RotateCcw, Save, Info } from "lucide-react"
import { useInferenceSettings } from "@/hooks/InferenceSettingsContext"

interface InferenceSettingsProps {
  open: boolean
  onClose: () => void
}

export default function InferenceSettings({ open, onClose }: InferenceSettingsProps) {
  const {
    showFace,
    setShowFace,
    showLeftHand,
    setShowLeftHand,
    showRightHand,
    setShowRightHand,
    showUpperBody,
    setShowUpperBody,
    showLowerBody,
    setShowLowerBody,
  } = useInferenceSettings()

  if (!open) return null

  const handleReset = () => {
    setShowFace(true)
    setShowLeftHand(true)
    setShowRightHand(true)
    setShowUpperBody(true)
    setShowLowerBody(true)
  }

  const activeCount = [showFace, showLeftHand, showRightHand, showUpperBody, showLowerBody].filter(Boolean).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md relative shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-secondary p-2 rounded-lg">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Analysis Settings</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Configure keypoint detection areas</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-gray-100">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Badge variant="secondary" className="text-xs">
              <Activity className="w-3 h-3 mr-1" />
              {activeCount}/5 Active
            </Badge>
            <Badge variant="outline" className="text-xs">
              Real-time Analysis
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Body Parts Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm text-foreground">Body Parts Detection</h3>
            </div>

            <div className="space-y-4 pl-6">
              {/* Face */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="face-toggle" className="font-medium cursor-pointer">
                      Face & Head
                    </Label>
                    <p className="text-xs text-muted-foreground">Head position and alignment</p>
                  </div>
                </div>
                <Switch id="face-toggle" checked={showFace} onCheckedChange={setShowFace} />
              </div>

              {/* Upper Body */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="upper-body-toggle" className="font-medium cursor-pointer">
                      Upper Body
                    </Label>
                    <p className="text-xs text-muted-foreground">Shoulders, chest, and torso</p>
                  </div>
                </div>
                <Switch id="upper-body-toggle" checked={showUpperBody} onCheckedChange={setShowUpperBody} />
              </div>

              {/* Lower Body */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="lower-body-toggle" className="font-medium cursor-pointer">
                      Lower Body
                    </Label>
                    <p className="text-xs text-muted-foreground">Hips, legs, and stance</p>
                  </div>
                </div>
                <Switch id="lower-body-toggle" checked={showLowerBody} onCheckedChange={setShowLowerBody} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Hand Detection Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Hand className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm text-foreground">Hand Detection</h3>
            </div>

            <div className="space-y-4 pl-6">
              {/* Left Hand */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">L</span>
                  </div>
                  <div>
                    <Label htmlFor="left-hand-toggle" className="font-medium cursor-pointer">
                      Left Hand
                    </Label>
                    <p className="text-xs text-muted-foreground">Support hand positioning</p>
                  </div>
                </div>
                <Switch id="left-hand-toggle" checked={showLeftHand} onCheckedChange={setShowLeftHand} />
              </div>

              {/* Right Hand */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">R</span>
                  </div>
                  <div>
                    <Label htmlFor="right-hand-toggle" className="font-medium cursor-pointer">
                      Right Hand
                    </Label>
                    <p className="text-xs text-muted-foreground">Primary grip and trigger hand</p>
                  </div>
                </div>
                <Switch id="right-hand-toggle" checked={showRightHand} onCheckedChange={setShowRightHand} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleReset} className="flex-1 bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
            {/* <Button onClick={onClose} size="sm" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Apply Settings
            </Button> */}
          </div>

          {/* Info Section */}
          <div className="bg-secondary border border rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="bg-background p-1 rounded">
                <Info className="w-3 h-3 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text">Note</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hiding keypoints only affects display, not analysis accuracy. Disable areas to focus your view.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
