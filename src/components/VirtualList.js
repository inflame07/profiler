import React, { Component, PropTypes } from 'react';

const VirtualListRow = ({renderItem, item, index}) => renderItem(item, index);

class VirtualList extends Component {

  constructor(props) {
    super(props);
    this._scrollListener = e => this.forceUpdate();
  }

  componentDidMount() {
    this.refs.container.addEventListener('scroll', this._scrollListener);
    this.forceUpdate(); // for initial size
  }

  componentWillUnmount() {
    this.refs.container.removeEventListener('scroll', this._scrollListener);
  }

  computeVisibleRange() {
    if (!this.refs.container) {
      return { visibleRangeStart: 0, visibleRangeEnd: 100 };
    }
    const { itemHeight } = this.props;
    const outerRect = this.refs.container.getBoundingClientRect();
    const innerRect = this.refs.inner.getBoundingClientRect();
    const overscan = 20;
    const chunkSize = 16;
    let visibleRangeStart = Math.floor((outerRect.top - innerRect.top) / itemHeight) - overscan;
    visibleRangeStart = Math.floor(visibleRangeStart / chunkSize) * chunkSize;
    let visibleRangeEnd = Math.ceil((outerRect.bottom - innerRect.top) / itemHeight) + overscan;
    visibleRangeEnd = Math.ceil(visibleRangeEnd / chunkSize) * chunkSize;
    return { visibleRangeStart, visibleRangeEnd };
  }

  render() {
    const { itemHeight, className, renderItem, items, focusable, onKeyDown } = this.props;

    const range = this.computeVisibleRange();
    const { visibleRangeStart, visibleRangeEnd } = range;
    return (
      <div className={className} ref='container' tabIndex={ focusable ? 0 : -1 } onKeyDown={onKeyDown}>
        <div className={`${className}Inner`} ref='inner'
              style={{
                height: `${items.length * itemHeight}px`,
                width: '3000px'
              }}>
          <div className={`${className}TopSpacer`}
               key={-1}
               style={{height: Math.max(0, visibleRangeStart) * itemHeight + 'px'}} />
          {
            items.map((item, i) => {
              if (i < visibleRangeStart || i >= visibleRangeEnd)
                return;
              return <VirtualListRow key={i} index={i} renderItem={renderItem} item={item}/>
            })
          }
        </div>
      </div>
    );
  }

}

export default VirtualList;
