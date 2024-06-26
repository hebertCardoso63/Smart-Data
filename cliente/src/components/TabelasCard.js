/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { Card } from 'antd';
const tabList = [
  {
    key: 'tab1',
    tab: 'tab1',
  },
  {
    key: 'tab2',
    tab: 'tab2',
  },
];
const contentList = {
  tab1: <p>content1</p>,
  tab2: <p>content2</p>,
};
const tabListNoTitle = [
  {
    key: 'article',
    label: 'article',
  },
  {
    key: 'app',
    label: 'app',
  },
  {
    key: 'project',
    label: 'project',
  },
];
const contentListNoTitle = {
  article: <p>article content</p>,
  app: <p>app content</p>,
  project: <p>project content</p>,
};
const cardTabelas = () => {
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
    const [activeTabKey2, setActiveTabKey2] = useState('app');
    const onTab1Change = (key) => {
        setActiveTabKey1(key);
    };
    const onTab2Change = (key) => {
        setActiveTabKey2(key);
    };
    return (
        <>
            <Card
                style={{
                width: '100%',
                }}
                title="Card title"
                extra={<a href="#">More</a>}
                tabList={tabList}
                activeTabKey={activeTabKey1}
                onTabChange={onTab1Change}
            >
                {contentList[activeTabKey1]}
            </Card>
                <br />
                <br />
            <Card
                style={{
                width: '100%',
                }}
                tabList={tabListNoTitle}
                activeTabKey={activeTabKey2}
                tabBarExtraContent={<a href="#">More</a>}
                onTabChange={onTab2Change}
                tabProps={{
                size: 'middle',
                }}
            >
                {contentListNoTitle[activeTabKey2]}
            </Card>
        </>
    );
};
export default cardTabelas;