import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import defineFunctionalComponent from '../util/defineFunctionalComponent'

export default defineFunctionalComponent(function NotFound () {
  const navigate = useNavigate()
  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <Button type='primary' onClick={() => navigate('/')}>
          Back Home
        </Button>
      }
    />
  )
})
