import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  CheckCircle,
  Loader2,
  Download,
  History,
  Zap,
  FileCode,
  Bug
} from "lucide-react";
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

interface SecurityIssue {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  file: string;
  line?: number;
  suggestion: string;
  codeSnippet?: string;
  autoFixable: boolean;
}

interface ScanResult {
  summary: {
    totalFiles: number;
    totalIssues: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    score: number; // 0-100
  };
  results: Array<{
    file: string;
    issues: SecurityIssue[];
  }>;
  timestamp: string;
  scanDuration: number;
}

export function AdminSecurityAudit() {
  const [report, setReport] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [fixingIssues, setFixingIssues] = useState(false);

  useEffect(() => {
    loadLastReport();
    loadHistory();
  }, []);

  const loadLastReport = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/last-report`,
        { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
      );
      const data = await res.json();
      if (data.ok && data.report) {
        setReport(data.report);
      }
    } catch (err) {
      console.error("Erro ao carregar último relatório:", err);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/history`,
        { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
      );
      const data = await res.json();
      if (data.ok) {
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    }
  };

  const runAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/audit`,
        { 
          method: 'POST',
          headers: { 
            "Authorization": `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json"
          }
        }
      );
      const data = await res.json();
      if (data.ok) {
        setReport(data.report);
        loadHistory();
      }
    } catch (err) {
      console.error("Erro ao executar auditoria:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFixes = async () => {
    if (!confirm("Isso irá gerar patches de correção. Deseja continuar?")) return;
    
    setFixingIssues(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4169bd43/security/generate-fixes`,
        {
          method: 'POST',
          headers: { 
            "Authorization": `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ reportId: report?.timestamp })
        }
      );
      const data = await res.json();
      if (data.ok) {
        // Download patch file
        downloadPatch(data.patch);
      }
    } catch (err) {
      console.error("Erro ao gerar correções:", err);
    } finally {
      setFixingIssues(false);
    }
  };

  const downloadPatch = (patch: string) => {
    const blob = new Blob([patch], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-fixes-${Date.now()}.patch`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${report.timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <ShieldCheck className="w-8 h-8 text-green-400" />;
    if (score >= 60) return <Shield className="w-8 h-8 text-yellow-400" />;
    return <ShieldAlert className="w-8 h-8 text-red-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/20 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Security Auditor</h2>
              <p className="text-sm text-gray-400 mt-1">
                Análise automática de vulnerabilidades em código-fonte
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={runAudit}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Escaneando...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Executar Scan
                </>
              )}
            </Button>

            <Button
              onClick={() => setShowHistory(!showHistory)}
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              <History className="w-4 h-4 mr-2" />
              Histórico
            </Button>
          </div>
        </div>
      </Card>

      {/* History Panel */}
      {showHistory && history.length > 0 && (
        <Card className="p-6 bg-black/40 border border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-4">Histórico de Auditorias</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((h, idx) => (
              <div 
                key={idx}
                className="p-3 bg-black/40 rounded border border-gray-700 hover:border-purple-500/40 transition-colors cursor-pointer"
                onClick={() => setReport(h.report)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white font-mono">{h.timestamp}</p>
                    <p className="text-xs text-gray-400">
                      {h.report.summary.totalIssues} issues encontradas
                    </p>
                  </div>
                  <Badge className={getSeverityColor(h.report.summary.critical > 0 ? 'critical' : 'low')}>
                    Score: {h.report.summary.score}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Security Score Dashboard */}
      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overall Score */}
            <Card className="p-6 bg-black/40 border border-purple-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Security Score</span>
                {getScoreIcon(report.summary.score)}
              </div>
              <div className={`text-4xl font-bold ${getScoreColor(report.summary.score)}`}>
                {report.summary.score}/100
              </div>
              <Progress 
                value={report.summary.score} 
                className="mt-3 h-2"
              />
            </Card>

            {/* Critical Issues */}
            <Card className="p-6 bg-black/40 border border-red-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Critical</span>
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-4xl font-bold text-red-400">
                {report.summary.critical}
              </div>
              <p className="text-xs text-gray-500 mt-2">Requer ação imediata</p>
            </Card>

            {/* High Issues */}
            <Card className="p-6 bg-black/40 border border-orange-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">High</span>
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <div className="text-4xl font-bold text-orange-400">
                {report.summary.high}
              </div>
              <p className="text-xs text-gray-500 mt-2">Alta prioridade</p>
            </Card>

            {/* Total Files Scanned */}
            <Card className="p-6 bg-black/40 border border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Files Scanned</span>
                <FileCode className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-4xl font-bold text-blue-400">
                {report.summary.totalFiles}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {report.scanDuration}ms de varredura
              </p>
            </Card>
          </div>

          {/* Issues Breakdown */}
          <Card className="p-6 bg-black/40 border border-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Vulnerabilidades Detectadas</h3>
              <div className="flex gap-2">
                <Button
                  onClick={downloadReport}
                  variant="outline"
                  size="sm"
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button
                  onClick={applyFixes}
                  disabled={fixingIssues || report.summary.totalIssues === 0}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {fixingIssues ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando Fixes...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Gerar Correções
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {report.results.map((result, idx) => (
                <div key={idx} className="border border-gray-700 rounded-lg p-4 bg-black/40">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bug className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-mono text-white">{result.file}</span>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300">
                      {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  <div className="space-y-3 mt-3">
                    {result.issues.map((issue, issueIdx) => (
                      <div 
                        key={issueIdx}
                        className={`p-3 rounded border ${getSeverityColor(issue.severity)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(issue.severity)}>
                              {issue.severity.toUpperCase()}
                            </Badge>
                            <span className="text-sm font-semibold text-white">{issue.type}</span>
                          </div>
                          {issue.autoFixable && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Auto-fixable
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-300 mb-2">
                          💡 {issue.suggestion}
                        </p>

                        {issue.codeSnippet && (
                          <pre className="text-xs bg-black/60 p-2 rounded border border-gray-800 overflow-x-auto">
                            <code className="text-gray-400">{issue.codeSnippet}</code>
                          </pre>
                        )}

                        {issue.line && (
                          <p className="text-xs text-gray-500 mt-2">
                            Linha {issue.line}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {report.results.length === 0 && (
                <div className="text-center py-12">
                  <ShieldCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    🎉 Nenhuma vulnerabilidade encontrada!
                  </h3>
                  <p className="text-gray-400">
                    Seu código passou em todas as verificações de segurança.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Scan Info */}
          <Card className="p-4 bg-black/40 border border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                Última varredura: {new Date(report.timestamp).toLocaleString('pt-BR')}
              </span>
              <span>
                Duração: {report.scanDuration}ms
              </span>
              <span>
                Total de issues: {report.summary.totalIssues}
              </span>
            </div>
          </Card>
        </>
      )}

      {/* No Report Yet */}
      {!report && !loading && (
        <Card className="p-12 bg-black/40 border border-purple-500/20 text-center">
          <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">
            Nenhuma auditoria executada ainda
          </h3>
          <p className="text-gray-400 mb-6">
            Clique em "Executar Scan" para iniciar a análise de segurança
          </p>
          <Button
            onClick={runAudit}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <Shield className="w-4 h-4 mr-2" />
            Iniciar Primeira Auditoria
          </Button>
        </Card>
      )}
    </div>
  );
}
