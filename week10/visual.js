function renderVisual(allApis) {
  G6.registerNode('file-node', {
    draw: function draw(cfg, group) {
      const keyShape = group.addShape('rect', {
        attrs: {
          x: 10,
          y: -12,
          fill: '#fff',
          stroke: null,
        },
      });
      let isLeaf = false;
      if (cfg.collapsed) {
        group.addShape('marker', {
          attrs: {
            symbol: 'triangle',
            x: 4,
            y: -2,
            r: 4,
            fill: '#666',
          },
          name: 'marker-shape',
        });
      } else if (cfg.children && cfg.children.length > 0) {
        group.addShape('marker', {
          attrs: {
            symbol: 'triangle-down',
            x: 4,
            y: -2,
            r: 4,
            fill: '#666',
          },
          name: 'marker-shape',
        });
      } else {
        isLeaf = true;
      }
      const shape = group.addShape('text', {
        attrs: {
          x: 15,
          y: 4,
          text: cfg.name,
          fill: '#666',
          fontSize: 16,
          textAlign: 'left',
        },
        name: 'text-shape',
      });
      const bbox = shape.getBBox();
      let backRectW = bbox.width;
      let backRectX = keyShape.attr('x');
      if (!isLeaf) {
        backRectW += 8;
        backRectX -= 15;
      }
      keyShape.attr({
        width: backRectW,
        height: bbox.height + 4,
        x: backRectX,
      });
      return keyShape;
    },
  });
  G6.registerEdge(
    'step-line',
    {
      getControlPoints: function getControlPoints(cfg) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        return [
          startPoint,
          {
            x: startPoint.x,
            y: endPoint.y,
          },
          endPoint,
        ];
      },
    },
    'polyline'
  );

  const width = document.getElementById('container').scrollWidth;
  const height = document.getElementById('container').scrollHeight || 500;
  const graph = new G6.TreeGraph({
    container: 'container',
    width,
    height,
    linkCenter: false,
    modes: {
      default: [
        {
          type: 'collapse-expand',
          animate: false,
          onChange: function onChange(item, collapsed) {
            const data = item.get('model');
            data.collapsed = collapsed;
            return true;
          },
        },
        'drag-canvas',
        'zoom-canvas',
      ],
    },
    defaultEdge: {
      style: {
        stroke: '#A3B1BF',
      },
    },
    layout: {
      type: 'indented',
      isHorizontal: true,
      direction: 'LR',
      indent: 30,
      getHeight: function getHeight() {
        return 16;
      },
      getWidth: function getWidth() {
        return 16;
      },
    },
  });

  const root = {
    id: 'root',
    name: 'web api',
    children: [],
  };
  const apiKeys = Object.keys(allApis);
  apiKeys.sort((a, b) => b - a);

  apiKeys.forEach((keyName, index) => {
    const item = allApis[keyName];

    const apiItem = {
      id: index,
      name: keyName + (item.spec ? `[${item.spec}]` : ''),
      collapsed: true,
      children: item.apis.map((subApiName, subIndex) => ({
        id: `${index}-${subIndex}`,
        name: subApiName,
      })),
    };

    root.children.push(apiItem);
  });

  graph.node((node) => {
    return {
      type: 'file-node',
      label: node.name,
    };
  });
  graph.edge(() => {
    return {
      type: 'step-line',
    };
  });

  graph.data(root);
  graph.render();
  graph.fitView();
}
