import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import * as maplibregl from 'maplibre-gl';
import { authorizedImage } from '@shared/api';
import { LetterAvatar } from '@shared/ui';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { formatTimeAgo, useNow } from '@shared/lib';

const CARD_WIDTH = 184;
const CARD_GAP = 54;

export type UserMarkerData = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  /** URL аватара API; null — рисуем первую букву. */
  avatarUrl: string | null;
  color: string;
  /** Находится ли человек в какой-либо зоне прямо сейчас. */
  inZone: boolean;
  zoneName: string | null;
  deviceLabel: string;
  updatedAt?: string;
};

type UserMarkerProps = {
  map: maplibregl.Map;
  user: UserMarkerData;
};

const pinPath =
  'M24 2C12.4 2 3 11.4 3 23c0 15.3 21 32.2 21 32.2S45 38.3 45 23C45 11.4 35.6 2 24 2Z';

/**
 * Метка члена семьи на карте: булавка с цветным ободом и загруженным
 * аватаром. При наведении рядом раскрывается карточка с именем, положением,
 * возрастом точки и устройством.
 */
export function UserMarker({ map, user }: UserMarkerProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const now = useNow(60_000);
  const [element] = useState<HTMLDivElement>(() => {
    const node = document.createElement('div');
    node.style.width = '48px';
    node.style.height = '58px';
    node.style.overflow = 'visible';
    node.style.pointerEvents = 'auto';
    return node;
  });
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [hovered, setHovered] = useState(false);
  const [side, setSide] = useState<'left' | 'right'>('right');

  useEffect(() => {
    if (!map || !element) return;

    const marker = new maplibregl.Marker({ element, anchor: 'bottom' })
      .setLngLat([user.lng, user.lat])
      .addTo(map);
    markerRef.current = marker;

    return () => {
      marker.remove();
      markerRef.current = null;
    };
    // Координаты обновляет отдельный эффект ниже — пересоздавать маркер
    // на каждую точку нельзя.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, map]);

  useEffect(() => {
    markerRef.current?.setLngLat([user.lng, user.lat]);
  }, [user.lat, user.lng]);

  useEffect(() => {
    const node = markerRef.current?.getElement();
    if (node) node.style.zIndex = hovered ? '10' : '';
  }, [hovered]);

  useEffect(() => {
    if (!hovered) return;
    const close = (event: PointerEvent) => {
      if (element.contains(event.target as Node)) return;
      setHovered(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [element, hovered]);

  const show = () => {
    const point = map.project([user.lng, user.lat]);
    const width = map.getContainer().clientWidth;
    setSide(point.x > width - (CARD_WIDTH + CARD_GAP + 16) ? 'left' : 'right');
    setHovered(true);
  };

  const hide = () => setHovered(false);

  const age = user.updatedAt ? Date.parse(user.updatedAt) : NaN;
  const hasDate = Number.isFinite(age);
  const online = hasDate && now.getTime() - age <= 2 * 60_000;
  const ago = hasDate ? formatTimeAgo(new Date(age), now) : null;
  const place = user.inZone
    ? user.zoneName
      ? t('map.markerInside', { name: user.zoneName })
      : t('map.markerInsideUnknown')
    : t('map.markerOutside');
  const status = hasDate
    ? [place, ago].filter(Boolean).join(' · ')
    : t('map.markerNoData');

  const cardStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: side === 'right' ? CARD_GAP : undefined,
    right: side === 'left' ? CARD_GAP : undefined,
    width: CARD_WIDTH,
    padding: '9px 11px 8px 12px',
    borderRadius: 14,
    backgroundColor: colors.surface,
    boxShadow:
      '0 10px 28px rgba(16, 24, 40, 0.18), 0 0 0 1px rgba(26, 26, 46, 0.05)',
    pointerEvents: 'none',
    zIndex: 20,
  };

  const arrowStyle: CSSProperties = {
    position: 'absolute',
    top: 18,
    left: side === 'right' ? -4 : undefined,
    right: side === 'left' ? -4 : undefined,
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.surface,
    transform: 'rotate(45deg)',
    boxShadow: '-1px 1px 2px rgba(16, 24, 40, 0.06)',
  };

  return createPortal(
    <div
      role="button"
      tabIndex={0}
      aria-label={`${user.name}. ${status}. ${user.deviceLabel}`}
      aria-expanded={hovered}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onClick={() => {
        if (window.matchMedia('(hover: none)').matches) setHovered(true);
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        setHovered((value) => !value);
      }}
      style={{
        position: 'relative',
        width: 48,
        height: 58,
        cursor: 'pointer',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        transformOrigin: '50% 100%',
        transition: 'transform 150ms ease',
      }}
    >
      <svg
        width="48"
        height="58"
        viewBox="0 0 48 58"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'drop-shadow(0 4px 8px rgba(16, 24, 40, 0.24))',
        }}
      >
        <path d={pinPath} fill={user.color} stroke="#FFFFFF" strokeWidth="3" />
        <circle cx="24" cy="23" r="17.5" fill="#FFFFFF" />
      </svg>

      <LetterAvatar
        source={user.avatarUrl ? authorizedImage(user.avatarUrl) : null}
        name={user.name}
        style={{
          position: 'absolute',
          left: 7,
          top: 6,
          width: 34,
          height: 34,
          borderRadius: 17,
        }}
      />

      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: 0,
          top: 4,
          zIndex: 2,
          width: 11,
          height: 11,
          borderRadius: '50%',
          backgroundColor: online ? '#2ECC71' : '#B9BDC9',
          border: '2.5px solid #FFFFFF',
          boxShadow: '0 1px 3px rgba(16, 24, 40, 0.2)',
        }}
      />

      {hovered ? (
        <div style={cardStyle} role="tooltip">
          <div style={arrowStyle} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              minWidth: 0,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                flexShrink: 0,
                borderRadius: '50%',
                backgroundColor: user.color,
              }}
            />
            <span
              style={{
                overflow: 'hidden',
                color: colors.ink,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 12,
                fontWeight: 700,
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {user.name}
            </span>
          </div>
          <div
            style={{
              margin: '3px 0 0 14px',
              overflow: 'hidden',
              color: colors.grey,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 10.5,
              fontWeight: 500,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {status}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              margin: '4px 0 0 14px',
              overflow: 'hidden',
              color: colors.inkSoft,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 10,
              fontWeight: 500,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            <svg
              width="9"
              height="11"
              viewBox="0 0 9 11"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <rect
                x="1"
                y="1"
                width="7"
                height="9"
                rx="1.6"
                stroke={colors.grey}
                strokeWidth="1.1"
                fill="none"
              />
              <path
                d="M3.5 8.8h2"
                stroke={colors.grey}
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>
            <span>{user.deviceLabel}</span>
          </div>
        </div>
      ) : null}
    </div>,
    element,
  );
}
