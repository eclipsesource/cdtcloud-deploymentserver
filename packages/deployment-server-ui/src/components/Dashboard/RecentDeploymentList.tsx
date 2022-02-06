import { Empty, List } from 'antd'
import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { RecentDeployment } from 'deployment-server'
import defineFunctionalComponent from '../../util/defineFunctionalComponent'
import { RecentDeploymentItem } from './RecentDeploymentItem'

import './RecentDeploymentList.scss'

interface Props {
  data: RecentDeployment[] | undefined,
  details?: boolean
}

export default defineFunctionalComponent(function RecentDeploymentList(props: Props) {
  return (props.data != null && props.data.length > 0 ?
      <List itemLayout={'horizontal'}>
        <TransitionGroup>
          {props.data.map((item: RecentDeployment) => (
            <CSSTransition key={item.id} timeout={750} classNames="deployment">
              <RecentDeploymentItem
                key={item.id}
                id={item.id}
                status={item.status}
                device={item.device}
                artifactUrl={item.artifactUrl}
                details={props.details}
                created={props.details ? item.createdAt : undefined}
                updated={props.details ? item.updatedAt : undefined}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </List>
      :
      <Empty
        className="nodata"
        description={'No Deployments'}
      />
  )
})
