import type { DeviceTypeWithCount } from "deployment-server";

import { useState, useEffect } from "react";
import { Card, Divider, List, Skeleton } from "antd";
import { FilterOutlined, InfoOutlined } from "@ant-design/icons";

import { defineFunctionalComponent } from "../util/defineFunctionalComponent";
import SkeletonButton from "antd/lib/skeleton/Button";
import MegaTest from "../ressources/mega.svg";
import { AutoComplete, Row, Col } from "antd";

const { Meta } = Card;

const isType = (
  type: DeviceTypeWithCount | {}
): type is DeviceTypeWithCount => {
  return typeof type === "object" && "id" in type;
};

export default defineFunctionalComponent(function Types() {
  const [types, setTypes] = useState<DeviceTypeWithCount[] | {}[]>(
    Array(15).fill({})
  );

  const options = [
    {
      value: "Burns Bay Road",
    },
    {
      value: "Downing Street",
    },
    {
      value: "Wall Street",
    },
  ];

  const Complete = () => (
    <AutoComplete
      style={{
        width: 250,
      }}
      options={types}
      placeholder="type to search`"
      filterOption={(inputValue, option) =>
        option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      }
    />
  );

  useEffect(() => {
    fetch("/api/device-types")
      .then((res) => res.json())
      .then(setTypes);
  }, []);

  return (
    <>
      <h2>Board Type Overview</h2>
      <Divider />
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}  align="middle">
        <Col span={6}>
          <Card
            title="Search Board Types"
            style={{ height: "100%" }}
          >
            <Complete />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="Supported Board Types in use"
            style={{ height: "100%" }}
          >
            <h2>Currently in use 4/27</h2>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="Most Used Board Types"
            style={{ height: "100%" }}
          >
            <h2> 1. Arduino Mega 2. Arduino Due 3. Arduino lol </h2>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            title="S"
            style={{ height: "100%" }}
          >
            INSERT GOOD INFORMATION
          </Card>
        </Col>
      </Row>
      <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}  align="middle">
      <Divider />
        <Col span={24}>
          <List
            style={{
              overflow: "scroll",
              overflowX: "hidden",
              padding: "24px",
              maxHeight: "calc(100% - 60px)",
            }}
            grid={{ gutter: 32 }}
            dataSource={types}
            renderItem={(type, index) => {
              if (isType(type)) {
                return (
                  <List.Item key={type.id}>
                    <Card
                      size="small"
                      hoverable
                      style={{ width: 240 }}
                      cover={
                        <img
                          alt={`${type.name} example image`}
                          height={"100%"}
                          src={MegaTest}
                        />
                      }
                      actions={[<FilterOutlined />, <InfoOutlined />]}
                    >
                      <Meta
                        title={type.name}
                        description={"FQBN:"+type.fqbn}
                        style={{ padding: "24px px" }}
                      />
                    </Card>
                  </List.Item>
                );
              } else {
                return (
                  <List.Item key={`placeholder-${index}`}>
                    <Card
                      hoverable
                      cover={
                        <Skeleton.Image
                          style={{ width: "300px", height: "220px" }}
                        />
                      }
                      actions={[<SkeletonButton />, <SkeletonButton />]}
                    >
                      <Skeleton
                        loading={true}
                        paragraph={{ rows: 1 }}
                      ></Skeleton>
                    </Card>
                  </List.Item>
                );
              }
            }}
          />
        </Col>
      </Row>
    </>
  );
});
