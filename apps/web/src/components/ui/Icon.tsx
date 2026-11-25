/**
 * Design system icons — sourced from Figma assets.
 * Usage: <Icon name="visao-geral" size={18} />
 */

export type IconName =
  | 'visao-geral'
  | 'tutor'
  | 'avaliacoes'
  | 'circle'
  | 'lock'
  | 'concluido'
  | 'desbloqueado'
  | 'dashed'
  | 'info-orange'
  | 'info-gray'
  | 'trilha'
  | 'search'
  | 'dot'
  | 'seal';

const ICON_SRC: Record<IconName, string> = {
  'visao-geral':   '/icons/icon-visao-geral.png',
  'tutor':         '/icons/icon-tutor.png',
  'avaliacoes':    '/icons/icon-avaliacoes.png',
  'circle':        '/icons/icon-circle.png',
  'lock':          '/icons/icon-lock.png',
  'concluido':     '/icons/icon-concluido.png',
  'desbloqueado':  '/icons/icon-desbloqueado.png',
  'dashed':        '/icons/icon-dashed.png',
  'info-orange':   '/icons/icon-info-orange.png',
  'info-gray':     '/icons/icon-info-gray.png',
  'trilha':        '/icons/icon-trilha.png',
  'search':        '/icons/icon-search.png',
  'dot':           '/icons/icon-dot.png',
  'seal':          '/icons/icon-seal.png',
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  alt?: string;
}

export function Icon({ name, size = 18, className, alt = '' }: IconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ICON_SRC[name]}
      alt={alt}
      aria-hidden={alt === '' ? true : undefined}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}
