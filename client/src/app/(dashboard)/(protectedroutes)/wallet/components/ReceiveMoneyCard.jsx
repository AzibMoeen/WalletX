import { QrCode, Copy, Check, Share2 } from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ReceiveMoneyCard = ({ wallet, user }) => {
  const [copiedItem, setCopiedItem] = useState(null)
  
  const copyToClipboard = (text, itemType) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(itemType)
      setTimeout(() => setCopiedItem(null), 2000)
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({    title: 'My WalletX ID',
      
          text: `Here's my WalletX ID: ${wallet.walletId}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      copyToClipboard(wallet.walletId, 'wallet');
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">Receive Money</CardTitle>
        <CardDescription>Share your wallet ID to receive funds</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0 md:pt-0 space-y-4 md:space-y-6">
        <div className="flex justify-center">
          <div className="bg-muted p-4 sm:p-6 md:p-8 rounded-xl inline-block">
            <QrCode className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 mx-auto" />
          </div>
        </div>
        
        <div className="space-y-2 md:space-y-3">
          <Label className="text-sm md:text-base">Your Wallet ID</Label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Input 
              value={wallet.walletId} 
              readOnly 
              className="font-mono text-sm truncate h-10"
            />
            <Button 
              variant="outline" 
              className="sm:ml-2 h-10" 
              onClick={() => copyToClipboard(wallet.walletId, 'wallet')}
            >
              {copiedItem === 'wallet' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-2">{copiedItem === 'wallet' ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            Share this ID with anyone who wants to send you money.
          </p>
        </div>
        
        <div className="space-y-2 md:space-y-3">
          <Label className="text-sm md:text-base">Your Email</Label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Input 
              value={user.email} 
              readOnly
              className="truncate h-10"
            />
            <Button 
              variant="outline" 
              className="sm:ml-2 h-10" 
              onClick={() => copyToClipboard(user.email, 'email')}
            >
              {copiedItem === 'email' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-2">{copiedItem === 'email' ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground">
            Others can also find your wallet using your email address.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
          <Button className="w-full sm:flex-1" variant="outline" onClick={() => copyToClipboard(wallet.walletId, 'wallet')}>
            <Copy className="mr-2 h-4 w-4" /> 
            Copy ID
          </Button>
          <Button className="w-full sm:flex-1" variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" /> 
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReceiveMoneyCard