import type { DeviceTypeWithCount } from 'deployment-server'

import { useState, useEffect } from 'react'
import { Card, Divider, List, Skeleton } from 'antd'
import { FilterOutlined, InfoOutlined } from '@ant-design/icons'

import { defineFunctionalComponent } from '../util/defineFunctionalComponent'
import SkeletonButton from 'antd/lib/skeleton/Button'

const { Meta } = Card

const isType = (
  type: DeviceTypeWithCount | {}
): type is DeviceTypeWithCount => {
  return typeof type === 'object' && 'id' in type
}

export default defineFunctionalComponent(function Types () {
  const [types, setTypes] = useState<DeviceTypeWithCount[] | Array<{}>>(
    Array(15).fill({})
  )

  useEffect(() => {
    fetch('/api/device-types')
      .then(async (res) => await res.json())
      .then(setTypes)
  }, [])

  return (
    <>
      <h2>Types</h2>
      <Divider />
      <List
        style={{
          overflow: 'scroll',
          overflowX: 'hidden',
          padding: '24px',
          maxHeight: 'calc(100% - 60px)'
        }}
        grid={{ gutter: 16 }}
        dataSource={types}
        renderItem={(type, index) => {
          if (isType(type)) {
            return (
              <List.Item key={type.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={`${type.name} example image`}
                      height={220}
                      src='https://picsum.photos/300/220'
                    />
                  }
                  actions={[<FilterOutlined />, <InfoOutlined />]}
                >
                  <Meta
                    title={type.name}
                    description={type.fqbn}
                    style={{ padding: '24px 0px' }}
                  />
                </Card>
              </List.Item>
            )
          } else {
            return (
              <List.Item key={`placeholder-${index}`}>
                <Card
                  hoverable
                  cover={
                    <Skeleton.Image
                      style={{ width: '300px', height: '220px' }}
                    />
                  }
                  actions={[<SkeletonButton />, <SkeletonButton />]}
                >
                  <Skeleton loading paragraph={{ rows: 1 }} />
                </Card>
              </List.Item>
            )
          }
        }}
      />
    </>
  )
})
