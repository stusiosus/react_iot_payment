import React, { useState } from "react";
import { Card, Col, Row } from "antd";
import { PaymentModal } from "./PaymentModal";
import { SettingsModal } from "./SettingsModal";
import { splititemsIntoGroups } from "../utils";

export function DynamicCardsAction({ items, eventcallback, setAlertMessage, setShowAlterMessage, setLoading }) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currrentAction, setCurrentAction] = useState(null);

  async function handleCardClick(entry) {
    setCurrentAction(entry);
    setPaymentOpen(true);
  }

  const handleMoreClick = async (e, entry) => {
    e.stopPropagation();
    setCurrentAction(entry);
    setSettingsOpen(true);
  }

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <div>
      {currrentAction ? (
        <PaymentModal
          open={paymentOpen}
          currrentAction={currrentAction}
          setOpen={setPaymentOpen}
          eventcallback={eventcallback}
          setAlertMessage={setAlertMessage}
          setShowAlterMessage={setShowAlterMessage}
          setLoading={setLoading}
        />
      ) : null}
      {currrentAction ? (
        <SettingsModal
          open={settingsOpen}
          currrentAction={currrentAction}
          setOpen={setSettingsOpen}
          eventcallback={eventcallback}
          setAlertMessage={setAlertMessage}
          setShowAlterMessage={setShowAlterMessage}
          setLoading={setLoading}
        />
      ) : null}

      {splititemsIntoGroups(items).map((group, index) => (
        <div key={index}>
          <Row gutter={16} justify="center">
            {group.map((entry) => (
              <Col span={8} key={entry.id}>
                <Card
                  hoverable
                  title={entry.name}
                  bordered={true}
                  extra={
                    <span>
                      {isAdmin ? (
                        <a onClick={(e) => handleMoreClick(e, entry)}>settings</a>
                      ) : null}
                    </span>
                  }
                  onClick={() => handleCardClick(entry)}
                >
                  <div>
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      {entry.price.toString()}{" "}
                    </span>
                    <span> for one </span>
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {entry.unit}
                    </span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <br />
          <br />
        </div>
      ))}
    </div>
  );
}
