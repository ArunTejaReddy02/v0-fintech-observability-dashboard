declare module 'sonner' {
  import * as React from 'react';
  export interface ToasterProps {
    theme?: 'light' | 'dark' | 'system';
    [key: string]: any;
  }
  export const Toaster: React.ComponentType<ToasterProps>;
}
