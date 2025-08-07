'use client';

import 'styled-components';
import { Theme } from '@/styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
