/*
 * @Author: Leo.Si
 * @Date: 2019-08-17 15:37:22
 * @Last Modified by: murphy.meng
 * @Last Modified time: 2021-08-09 04:26:28
 */

import React from "react";
import PropTypes from "prop-types";
import DataLink from "../../Atoms/DataLink";

const DEFAULTPROPS = {
  _data: [],
};

const PROPTYPES = {
  _data: PropTypes.array,
  _clickCallback: PropTypes.func,
};

const OptionList = ({ _data, _userGroup, _clickCallback }) => (
  <div className="option-lists">
    {_data &&
      _data.map((list, i) => {
        const {
          href,
          callbackKEY,
          name,
          className,
          iconUrl,
          SensorName,
          usergroup,
        } = list;
        if (_userGroup && !_userGroup.userGroup && usergroup)
          return <div key="option-lists" />;
        return (
          <DataLink
            _Href={href ? href : null}
            key={`option-lists--${i}`}
            _Omniture=""
            _Title=""
            _Content=""
            _Https="https"
            _Sensor={{
              eventKey: "myAccountClick",
              value: {
                $lib_detail: "M_NewMobile##getSensorData##OptionList.js##32",
                button_name: SensorName,
              },
            }}
            _ClickCallback={
              _clickCallback ? _clickCallback.bind(this, callbackKEY) : null
            }
          >
            <div className={className}>
              <p>{name}</p>
              {iconUrl && <img src={iconUrl} />}
            </div>
          </DataLink>
        );
      })}
  </div>
);

OptionList.defaultProps = DEFAULTPROPS;
OptionList.propTypes = PROPTYPES;

export default OptionList;
