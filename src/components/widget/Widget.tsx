import React, { useState } from "react";
import "./widget.css";

import { chevronUpOutline, chevronDownOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

const Widget: React.FC<any> = ({ data }) => {
  const diff = 20;

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
         <span className="size-18">{data.isMoney && "AED"}</span> {data.total}
        </span>
        {data?.link ? (
          <a className="link" href={data.linkURL}>
            {data.link}
          </a>
        ) : (
          <span> &nbsp;</span>
        )}
      </div>
      <div className="right">
        {/***** 
        <div
          className={`percentage ${
            data.difference > 0 ? "positive" : "negative"
          } `}
        >
          <IonIcon
            icon={data.difference > 0 ? chevronUpOutline : chevronDownOutline}
            size="small"
          />{" "}
          {data.difference} %
        </div> 
        */}
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
