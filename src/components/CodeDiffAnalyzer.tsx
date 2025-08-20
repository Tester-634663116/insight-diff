import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Loader2, Zap, AlertTriangle, CheckCircle, Code } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AnalysisResult {
  issues: string[];
  solutions: string[];
}

const CodeDiffAnalyzer = () => {
  const [codeDiff, setCodeDiff] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!codeDiff.trim()) {
      toast({
        title: "Error",
        description: "Please enter a code diff to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis - replace with actual AI API call
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        issues: [
          "Potential null pointer exception in line 15",
          "Memory leak detected in async operation",
          "Deprecated API usage found",
          "Missing error handling for database operations",
          "Performance bottleneck in nested loops"
        ],
        solutions: [
          "Add null checks before accessing object properties",
          "Implement proper cleanup for event listeners and timers",
          "Update to the latest API version with better security",
          "Add try-catch blocks around database queries",
          "Consider using more efficient data structures or algorithms"
        ]
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Found potential issues and solutions",
      });
    }, 2000);
  };

  const copyToClipboard = (text: string[], type: string) => {
    const formattedText = text.map((item, index) => `${index + 1}. ${item}`).join('\n');
    navigator.clipboard.writeText(formattedText);
    
    toast({
      title: "Copied to clipboard",
      description: `${type} copied successfully`,
    });
  };

  const formatCodeDiff = (diff: string) => {
    return diff.split('\n').map((line, index) => {
      let className = 'diff-neutral';
      if (line.startsWith('+')) {
        className = 'diff-addition';
      } else if (line.startsWith('-')) {
        className = 'diff-deletion';
      }
      
      return (
        <div key={index} className={`px-4 py-1 ${className}`}>
          {line || ' '}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/20 glow-effect animate-float">
              <Code className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-5xl font-bold gradient-text">
              CodeDiff Insight
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered code difference analysis that identifies potential issues and provides intelligent solutions
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Real-time Analysis
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Code Difference Input
              </CardTitle>
              <CardDescription>
                Paste your code diff here. Supports unified diff format, git diff output, or any before/after code comparison.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder={`Example:
- function oldMethod() {
-   return data.value;
- }
+ function newMethod() {
+   return data?.value || defaultValue;
+ }`}
                  value={codeDiff}
                  onChange={(e) => setCodeDiff(e.target.value)}
                  className="min-h-[300px] font-mono text-sm resize-none bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              
              {codeDiff && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Preview:</h4>
                  <div className="bg-muted/30 rounded-lg border border-border/50 overflow-hidden">
                    <div className="code-diff max-h-32 overflow-y-auto">
                      {formatCodeDiff(codeDiff)}
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !codeDiff.trim()}
                className="w-full bg-gradient-primary hover:opacity-90 glow-effect"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Code...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze Code Diff
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Issues */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    Potential Issues
                  </div>
                  {analysisResult?.issues && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(analysisResult.issues, 'Issues')}
                      className="border-warning/20 text-warning hover:bg-warning/10"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!analysisResult && !isAnalyzing && (
                  <p className="text-muted-foreground text-center py-8">
                    Issues will appear here after analysis
                  </p>
                )}
                
                {isAnalyzing && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                    <span className="text-muted-foreground">Scanning for issues...</span>
                  </div>
                )}
                
                {analysisResult?.issues && (
                  <div className="space-y-3">
                    {analysisResult.issues.map((issue, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
                        <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{issue}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Solutions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    Suggested Solutions
                  </div>
                  {analysisResult?.solutions && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(analysisResult.solutions, 'Solutions')}
                      className="border-success/20 text-success hover:bg-success/10"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!analysisResult && !isAnalyzing && (
                  <p className="text-muted-foreground text-center py-8">
                    Solutions will appear here after analysis
                  </p>
                )}
                
                {isAnalyzing && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                    <span className="text-muted-foreground">Generating solutions...</span>
                  </div>
                )}
                
                {analysisResult?.solutions && (
                  <div className="space-y-3">
                    {analysisResult.solutions.map((solution, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{solution}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeDiffAnalyzer;