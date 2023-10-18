/*
 * @Author: Leo.Si
 * @Date: 2019-08-16 15:13:49
 * @Last Modified by: summer
 * @Last Modified time: 2020-12-22 11:33:07
 */
import React from 'react';
import PropTypes from 'prop-types';
import DataLink from '../../Atoms/DataLink';
const DEFAULTPROPS = {
  _data: [],
};

const PROPTYPES = {
  _data: PropTypes.array,
  _clickCallback: PropTypes.func,
};

const ToolLists = ({ _data, _clickCallback }) => (
  <div className="tool-lists">
    {_data.map((list, i) => {
      const { href, callbackKEY, name, iconClass, content, imgUrl, moreClass, SensorName } = list;
      let newHref = href;
      if (name == '兑换记录') newHref = `${href}?timeStamp=${new Date().getTime()}`;
      return (
        <DataLink
          _Href={href ? newHref : null}
          key={`tools-${i}`}
          _Omniture=""
          _Title=""
          _Content=""
          _Https="https"
          _Sensor={{
            eventKey: 'myAccountClick',
            value: {
              $lib_detail: 'M_NewMobile##getSensorData##ToolLists.js##31',
              button_name: SensorName,
            },
          }}
          _ClickCallback={_clickCallback ? _clickCallback.bind(this, callbackKEY) : null}
        >
          <div className={'list-icon-or-content ' + (iconClass || '')}>
            <img src={imgUrl} />
            {content ? <span className={`redNum ${moreClass}`}>{content}</span> : null}
          </div>
          <div className="lists-font-type">{list.name}</div>
        </DataLink>
      );
    })}
  </div>
);

ToolLists.defaultProps = DEFAULTPROPS;
ToolLists.propTypes = PROPTYPES;

export default ToolLists;
