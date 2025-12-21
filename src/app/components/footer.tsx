import { 
  Mail, 
  MessageCircle, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  MapPin,
  Phone,
  Clock,
  Shield,
  Heart,
  Swords
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * 🎯 FOOTER - MeuMU Online
 * 
 * Footer com informações:
 * - Contato (Email, Discord, WhatsApp)
 * - Links úteis (FAQ, Regras, Termos)
 * - Redes sociais
 * - Copyright
 * 
 * ⚠️ z-index: 40 (abaixo navbar z-100 e language selector z-110)
 */

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-40 mt-auto">
      {/* Linha decorativa superior */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      
      {/* Footer principal */}
      <div className="backdrop-blur-xl bg-black/80 border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Coluna 1: Sobre o Servidor */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gold to-yellow-700 rounded-lg flex items-center justify-center shadow-lg shadow-gold/50">
                  <Swords className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl text-white">
                  MeuMU <span className="text-gold">Online</span>
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Season 19-2-3 - Servidor Épico de Mu Online com as melhores taxas e eventos exclusivos.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Feito com amor para a comunidade MU</span>
              </div>
            </div>

            {/* Coluna 2: Links Úteis */}
            <div>
              <h3 className="text-lg text-white font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold" />
                Links Úteis
              </h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-gold transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    FAQ - Perguntas Frequentes
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-gold transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Regras do Servidor
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-gold transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-gold transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Política de Privacidade
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-gold transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    Como Doar
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Contato */}
            <div>
              <h3 className="text-lg text-white font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-gold" />
                Contato
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="mailto:contato@meumu.com" 
                    className="text-gray-400 hover:text-gold transition-colors text-sm flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-gold" />
                    contato@meumu.com
                  </a>
                </li>
                <li>
                  <a 
                    href="https://discord.gg/meumu" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gold transition-colors text-sm flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#5865F2]" />
                    Discord: /meumu
                  </a>
                </li>
                <li>
                  <a 
                    href="https://wa.me/5511999999999" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gold transition-colors text-sm flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-[#25D366]" />
                    WhatsApp: +55 11 99999-9999
                  </a>
                </li>
                <li className="flex items-start gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  <span>Suporte: Seg-Sex<br />09:00 - 18:00 (GMT-3)</span>
                </li>
              </ul>
            </div>

            {/* Coluna 4: Redes Sociais */}
            <div>
              <h3 className="text-lg text-white font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                Redes Sociais
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Siga-nos nas redes sociais para ficar por dentro de todas as novidades!
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="https://facebook.com/meumu" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#1877F2]/20 border border-[#1877F2]/30 flex items-center justify-center hover:bg-[#1877F2]/30 hover:border-[#1877F2]/50 transition-all group"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="https://twitter.com/meumu" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 flex items-center justify-center hover:bg-[#1DA1F2]/30 hover:border-[#1DA1F2]/50 transition-all group"
                  title="Twitter"
                >
                  <Twitter className="w-5 h-5 text-[#1DA1F2] group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="https://instagram.com/meumu" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F58529]/20 to-[#DD2A7B]/20 border border-[#F58529]/30 flex items-center justify-center hover:from-[#F58529]/30 hover:to-[#DD2A7B]/30 transition-all group"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5 text-[#E1306C] group-hover:scale-110 transition-transform" />
                </a>
                <a 
                  href="https://youtube.com/@meumu" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#FF0000]/20 border border-[#FF0000]/30 flex items-center justify-center hover:bg-[#FF0000]/30 hover:border-[#FF0000]/50 transition-all group"
                  title="YouTube"
                >
                  <Youtube className="w-5 h-5 text-[#FF0000] group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-gold/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © {currentYear} <span className="text-gold font-semibold">MeuMU Online</span> - Todos os direitos reservados.
              </p>
              <p className="text-gray-500 text-xs text-center md:text-right">
                MU Online™ é uma marca registrada da Webzen Inc. Este servidor é um projeto privado não oficial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
