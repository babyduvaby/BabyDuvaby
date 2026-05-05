declare module '@payloadcms/next/css' {
  const content: string
  export default content
}

declare module '*.css' {
  const content: string
  export default content
}

declare module '@payloadcms/next/layouts' {
  import { ReactNode } from 'react'

  interface RootLayoutProps {
    config: any
    children: ReactNode
    importMap?: any
  }

  export function RootLayout(props: RootLayoutProps): JSX.Element
  export const metadata: any
}

declare module '@payloadcms/next/views' {
  import { Metadata } from 'next'

  interface RootPageProps {
    config: any
    params: Promise<any>
    searchParams: Promise<any>
    importMap?: any
  }

  export function RootPage(props: RootPageProps): JSX.Element
  export function generatePageMetadata(props: {
    config: any
    params: Promise<any>
    searchParams: Promise<any>
  }): Promise<Metadata>
}

declare module '@payloadcms/next/routes' {
  import { NextRequest } from 'next/server'
  import { NextResponse } from 'next/server'

  export function REST_GET(config: any): (req: NextRequest, args: any) => Promise<NextResponse>
  export function REST_POST(config: any): (req: NextRequest, args: any) => Promise<NextResponse>
  export function REST_DELETE(config: any): (req: NextRequest, args: any) => Promise<NextResponse>
  export function REST_PATCH(config: any): (req: NextRequest, args: any) => Promise<NextResponse>
  export function REST_OPTIONS(config: any): (req: NextRequest, args: any) => Promise<NextResponse>
  export function GRAPHQL_POST(config: any): (req: NextRequest, args: any) => Promise<NextResponse>
  export function GRAPHQL_PLAYGROUND_GET(config: any): (req: NextRequest, args: any) => Promise<NextResponse>
}
