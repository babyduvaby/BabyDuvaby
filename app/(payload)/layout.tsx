/* Payload CMS Root Layout */
import React from 'react'

import config from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'
import { importMap } from '../../admin/importMap'
import '@payloadcms/next/css'
import '../../src/index.css'

type Args = {
  children: React.ReactNode
}

const PayloadRootLayout = ({ children }: Args) =>
  RootLayout({ config, children, importMap })

export default PayloadRootLayout
