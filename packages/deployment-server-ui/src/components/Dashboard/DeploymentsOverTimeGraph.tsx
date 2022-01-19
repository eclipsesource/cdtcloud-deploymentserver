import { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import defineFunctionalComponent from '../../util/defineFunctionalComponent';

type DataEntries = {xField: string, yField: string}[]

export default defineFunctionalComponent(function DeploymentsOverTimeGraph() {
  const [data, setData] = useState<DataEntries>([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => setData(Object.entries<string>(json.deploymentsPerBucket).reduce<DataEntries>((acc,[key,value]) => ([...acc, ({ xField: key, yField: value })]), [])))
  };

  const config = {
    data,
    padding: "auto" as const,
    xField: 'xField',
    yField: 'yField',
    xAxis: {
      // type: 'timeCat',
      tickCount: 1,
    },
    smooth: true,
  };

  return (
  <Line {...config} />
  );
});