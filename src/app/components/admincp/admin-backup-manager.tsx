import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Download, TestTube, Database, CheckCircle, AlertCircle, Loader2, Clock, Calendar as CalendarIcon, Zap } from "lucide-react";
import { backendUrl, getAuthHeaders } from '../../config/backend';

interface ScheduleConfig {
  enabled: boolean;
  frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
  customDate?: string;
  lastRun?: string;
  nextRun?: string;
}

export function AdminBackupManager() {
  const [dir, setDir] = useState("/tmp/backups/");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [backups, setBackups] = useState<string[]>([]);
  
  // Scheduling
  const [schedule, setSchedule] = useState<ScheduleConfig>({
    enabled: false,
    frequency: 'none'
  });
  const [customDateTime, setCustomDateTime] = useState("");
  const [useGzip, setUseGzip] = useState(true);

  useEffect(() => {
    loadScheduleConfig();
  }, []);

  const loadScheduleConfig = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/system/backup-schedule`,
        { headers: getAuthHeaders() }
      );
      const data = await res.json();
      if (data.ok && data.schedule) {
        setSchedule(data.schedule);
        if (data.schedule.customDate) {
          setCustomDateTime(data.schedule.customDate);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar configuração de agendamento:", err);
    }
  };

  const handleBackup = async () => {
    setIsLoading(true);
    setStatus("Criando backup" + (useGzip ? " comprimido (gzip)" : "") + "...");
    try {
      const res = await fetch(`${backendUrl}/system/backup`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          directory: dir,
          useGzip 
        }),
      });
      const data = await res.json();
      setStatus(data.message || "Backup executado com sucesso");
      setIsSuccess(data.ok);
      if (data.ok) {
        loadBackups();
      }
    } catch (err) {
      setStatus(`Erro ao criar backup: ${err}`);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestBackup = async () => {
    setIsLoading(true);
    setStatus("Testando configuração de backup...");
    try {
      const res = await fetch(`${backendUrl}/system/test-backup`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ directory: dir }),
      });
      const data = await res.json();
      setStatus(data.message || "Teste concluído");
      setIsSuccess(data.ok);
    } catch (err) {
      setStatus(`Erro no teste: ${err}`);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSchedule = async () => {
    setIsLoading(true);
    setStatus("Salvando configuração de agendamento...");
    try {
      const scheduleData: ScheduleConfig = {
        enabled: schedule.frequency !== 'none',
        frequency: schedule.frequency,
        customDate: schedule.frequency === 'custom' ? customDateTime : undefined
      };

      const res = await fetch(
        `${backendUrl}/system/schedule-backup`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ 
            directory: dir,
            schedule: scheduleData,
            useGzip
          }),
        }
      );
      const data = await res.json();
      setStatus(data.message || "Agendamento salvo");
      setIsSuccess(data.ok);
      if (data.ok) {
        loadScheduleConfig();
      }
    } catch (err) {
      setStatus(`Erro ao salvar agendamento: ${err}`);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBackups = async () => {
    try {
      const res = await fetch(`${backendUrl}/system/list-backups`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.ok) {
        setBackups(data.backups || []);
      }
    } catch (err) {
      console.error("Erro ao carregar lista de backups:", err);
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  return (
    <Card className="p-6 bg-black/40 border border-[#FFB800]/20 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-8 h-8 text-[#FFB800]" />
        <div>
          <h2 className="text-2xl font-bold text-white">Backup & Scheduler</h2>
          <p className="text-sm text-gray-400">Gerenciamento avançado com agendamento automático</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Configuração de Diretório */}
        <div>
          <Label className="text-sm text-gray-300 mb-2 font-semibold">
            Diretório de Backup
          </Label>
          <Input 
            value={dir} 
            onChange={e => setDir(e.target.value)}
            className="bg-black/60 border-[#FFB800]/30 text-white mt-2"
            placeholder="/tmp/backups/"
          />
          <p className="text-xs text-gray-400 mt-1">
            ⚠️ Apenas /tmp/ está disponível no ambiente Supabase
          </p>
        </div>

        {/* Opções de Compressão */}
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <div>
                <Label className="text-sm font-semibold text-white">Compressão GZIP</Label>
                <p className="text-xs text-gray-400">Reduz até 80% do tamanho do backup</p>
              </div>
            </div>
            <Button
              onClick={() => setUseGzip(!useGzip)}
              variant={useGzip ? "default" : "outline"}
              className={useGzip 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "border-gray-600 text-gray-400"
              }
            >
              {useGzip ? "✓ Ativado" : "Desativado"}
            </Button>
          </div>
        </div>

        {/* Agendamento */}
        <div className="p-5 bg-black/60 rounded-lg border border-[#FFB800]/20">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[#FFB800]" />
            <h3 className="text-lg font-semibold text-white">Agendamento Automático</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-300 mb-2">Frequência</Label>
              <Select 
                value={schedule.frequency} 
                onValueChange={(value: any) => setSchedule({ ...schedule, frequency: value })}
              >
                <SelectTrigger className="bg-black/60 border-[#FFB800]/30 text-white mt-2">
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent className="bg-black border-[#FFB800]/30">
                  <SelectItem value="none">Manual (Sem agendamento)</SelectItem>
                  <SelectItem value="daily">Diário (04:00)</SelectItem>
                  <SelectItem value="weekly">Semanal (Domingo 04:00)</SelectItem>
                  <SelectItem value="monthly">Mensal (Dia 1 às 04:00)</SelectItem>
                  <SelectItem value="custom">Data/Hora Customizada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {schedule.frequency === 'custom' && (
              <div>
                <Label className="text-sm text-gray-300 mb-2 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Data e Hora Específica
                </Label>
                <Input
                  type="datetime-local"
                  value={customDateTime}
                  onChange={e => setCustomDateTime(e.target.value)}
                  className="bg-black/60 border-[#FFB800]/30 text-white mt-2"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Configure ano, mês, dia, hora e minuto exatos
                </p>
              </div>
            )}

            {schedule.enabled && schedule.nextRun && (
              <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
                <p className="text-xs text-green-300">
                  ⏰ Próxima execução agendada: <span className="font-mono font-semibold">{schedule.nextRun}</span>
                </p>
              </div>
            )}

            {schedule.lastRun && (
              <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                <p className="text-xs text-blue-300">
                  ✓ Último backup automático: <span className="font-mono">{schedule.lastRun}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 flex-wrap">
          <Button 
            onClick={handleBackup}
            disabled={isLoading}
            className="bg-gradient-to-r from-[#FFB800] to-[#FF8800] hover:from-[#FF8800] hover:to-[#FFB800] text-black font-bold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Criar Backup Agora
              </>
            )}
          </Button>

          <Button 
            onClick={handleTestBackup} 
            disabled={isLoading}
            variant="outline"
            className="border-[#FFB800]/50 text-[#FFB800] hover:bg-[#FFB800]/10"
          >
            <TestTube className="w-4 h-4 mr-2" />
            Testar Configuração
          </Button>

          <Button 
            onClick={saveSchedule}
            disabled={isLoading || schedule.frequency === 'none'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Clock className="w-4 h-4 mr-2" />
            Salvar Agendamento
          </Button>

          <Button 
            onClick={loadBackups}
            variant="outline"
            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
          >
            Listar Backups
          </Button>
        </div>

        {/* Status */}
        {status && (
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${
            isSuccess === true 
              ? 'bg-green-500/10 border-green-500/30' 
              : isSuccess === false 
              ? 'bg-red-500/10 border-red-500/30' 
              : 'bg-blue-500/10 border-blue-500/30'
          }`}>
            {isSuccess === true && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />}
            {isSuccess === false && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
            <p className="text-sm text-gray-200">{status}</p>
          </div>
        )}

        {/* Lista de Backups */}
        {backups.length > 0 && (
          <div className="border border-[#FFB800]/20 rounded-lg p-4 bg-black/60">
            <h3 className="text-lg font-semibold text-white mb-3">Backups Disponíveis</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {backups.map((backup, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-black/40 rounded border border-gray-700 hover:border-[#FFB800]/40 transition-colors flex items-center justify-between"
                >
                  <p className="text-sm text-gray-300 font-mono">{backup}</p>
                  {backup.includes('.gz') && (
                    <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                      GZIP
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações Técnicas */}
        <div className="p-4 bg-black/60 rounded-lg border border-gray-700">
          <h3 className="text-sm font-semibold text-[#FFB800] mb-2">ℹ️ Recursos Avançados</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• <strong>GZIP:</strong> Compressão automática reduz 70-80% do tamanho</li>
            <li>• <strong>Agendamento:</strong> Backups automáticos em horários configurados</li>
            <li>• <strong>Cache Inteligente:</strong> Diagnósticos em cache por 60s</li>
            <li>• <strong>Formato:</strong> muonline_backup_TIMESTAMP.sql{useGzip ? '.gz' : ''}</li>
            <li>• <strong>Recorrência:</strong> Diário, semanal, mensal ou customizado</li>
            <li>• <strong>Logs:</strong> Todas as operações são registradas</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}