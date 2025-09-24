import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Database } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CodeBlockProps {
  code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Código copiado",
        description: "El código SQL se ha copiado al portapapeles",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo copiar el código",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-blue-200 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Database className="w-5 h-5" />
            <span>Código MySQL Generado</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="border-blue-200 hover:bg-blue-50"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copied ? 'Copiado' : 'Copiar'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-blue-900 font-mono whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}