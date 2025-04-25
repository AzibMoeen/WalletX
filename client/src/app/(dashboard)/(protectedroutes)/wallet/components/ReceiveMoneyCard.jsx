import { QrCode, Copy, Check, Share2 } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ReceiveMoneyCard = ({ wallet, user }) => {
  const [copied, setCopied] = useState(false)
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receive Money</CardTitle>
        <CardDescription>Share your wallet ID to receive funds</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <div className="bg-muted p-8 rounded-xl inline-block">
            <QrCode className="h-32 w-32 mx-auto" />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Your Wallet ID</Label>
          <div className="flex">
            <Input 
              value={wallet.walletId} 
              readOnly 
              className="font-mono"
            />
            <Button 
              variant="outline" 
              className="ml-2" 
              onClick={() => copyToClipboard(wallet.walletId)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Share this ID with anyone who wants to send you money.
          </p>
        </div>
        
        <div className="space-y-3">
          <Label>Your Email</Label>
          <div className="flex">
            <Input 
              value={user.email} 
              readOnly
            />
            <Button 
              variant="outline" 
              className="ml-2" 
              onClick={() => copyToClipboard(user.email)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Others can also find your wallet using your email address.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button className="flex-1" variant="outline" onClick={() => copyToClipboard(wallet.walletId)}>
            <Copy className="mr-2 h-4 w-4" /> 
            Copy ID
          </Button>
          <Button className="flex-1" variant="outline">
            <Share2 className="mr-2 h-4 w-4" /> 
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReceiveMoneyCard