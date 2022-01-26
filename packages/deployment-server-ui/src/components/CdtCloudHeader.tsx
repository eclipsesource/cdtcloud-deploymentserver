import { Header } from 'antd/lib/layout/layout'

export function CdtCloudHeader (): JSX.Element {
  return (
    <Header className='header'>
      <div className='logo' />
      <h2 style={{ color: 'rgba(255, 255, 255, 0.65)', textAlign: 'center' }}>
        Embedded Cloud Development - Admin Dashboard
      </h2>
    </Header>
  )
}
