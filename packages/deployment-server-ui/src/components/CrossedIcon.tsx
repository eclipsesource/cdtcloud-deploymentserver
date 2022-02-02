import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import styles from './CrossedIcon.module.scss'

interface Props {
  icon: JSX.Element
}

export const CrossedIcon = (props: Props): JSX.Element => {
  return (
    <div className={styles.crossed}>
      {props.icon}
      <FontAwesomeIcon icon={'slash'} className={styles.slash}/>
    </div>
  )
}
