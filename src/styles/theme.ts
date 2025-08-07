export const theme = {
  colors: {
    primary: '#FF6B6B',        // 메인 컬러
    secondary: '#4ECDC4',      // 보조 컬러
    background: '#FFFFFF',     // 배경색
    surface: '#F8F9FA',        // 카드 배경색
    text: {
      primary: '#2C3E50',      // 주요 텍스트
      secondary: '#7F8C8D',    // 보조 텍스트
      light: '#95A5A6'         // 연한 텍스트
    },
    border: '#E9ECEF',         // 테두리
    shadow: 'rgba(0, 0, 0, 0.1)', // 그림자
    ranking: {
      up: '#27AE60',           // 상승 (초록)
      down: '#E74C3C',         // 하락 (빨강)
      same: '#95A5A6'          // 변동없음 (회색)
    },
    filter: {
      active: '#FF6B6B',       // 활성화된 필터
      inactive: '#ECF0F1'      // 비활성화된 필터
    }
  },
  
  fonts: {
    size: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
    },
    weight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
  },
  
  borderRadius: {
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  
  breakpoints: {
    mobile: '767px',
    tablet: '1023px',
    desktop: '1024px'
  }
} as const;

export type Theme = typeof theme;
