/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/
import { Empty, List } from 'antd'
import React from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { RecentDeployment } from 'deployment-server'
import defineFunctionalComponent from '../../util/defineFunctionalComponent'
import { RecentDeploymentItem } from './RecentDeploymentItem'

import './RecentDeploymentList.scss'

interface Props {
  data: RecentDeployment[] | undefined
  details?: boolean
}

export default defineFunctionalComponent(function RecentDeploymentList (props: Props) {
  return (props.data != null && props.data.length > 0
    ? <List itemLayout={'horizontal'}>
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
                created={(props.details ?? false) ? item.createdAt : undefined}
                updated={(props.details ?? false) ? item.updatedAt : undefined}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </List>
    : <Empty
        className="nodata"
        description={'No Deployments'}
      />
  )
})
