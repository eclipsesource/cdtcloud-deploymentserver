import { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import defineFunctionalComponent from '../../util/defineFunctionalComponent';

export default defineFunctionalComponent(function DeploymentsOverTimeGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
      .then((res) => res.json())
      .then((json) => setData(json));
  };

  const config = {
    data,
    padding: "auto" as const,
    xField: 'Date',
    yField: 'scales',
    xAxis: {
      // type: 'timeCat',
      tickCount: 5,
    },
    smooth: true,
  };

  return (
  <Line {...config} />
  );
});