/* Payload CMS Admin Page - routed at /cms */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../../../../admin/importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const PayloadAdminRootPage = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap })

export default PayloadAdminRootPage
