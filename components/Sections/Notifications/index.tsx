"use client";

import { Notification } from "@/components/Units";
import { LOCALSTORAGES } from "@/constants";
import { notificationInterface } from "@/interfaces";
import { fetchConfigurations } from "@/services/configurationsApi";
import {
  getDataFromLocalStorageWithExpiry,
  saveDataInLocalStorage,
} from "@/utils/calcUtils";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";

const Notifications: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<notificationInterface[]>(
    []
  );
  const [hiddenNotificationIds, setHiddenNotificationIds] = useState<string[]>(
    []
  );
  const [fadeOutNotificationIds, setFadeOutNotificationIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    getInitData();
  }, []);

  const getInitData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const data = (await fetchConfigurations())["notifications"].filter(
        (d) => d.expired_at > new Date().getTime()
      );
      setNotifications(data);
      setHiddenNotificationIds(
        getDataFromLocalStorageWithExpiry(
          LOCALSTORAGES.HIDDEN_NOTIFICATION_IDS
        ) || []
      );
    } catch (err) {
      console.log("Error fetching the initial data");
    } finally {
      setIsLoading(false);
    }
  };

  const onClickHideNotification = (id: string) => {
    if (!notifications.find((notification) => notification.id === id)) {
      return;
    }
    setFadeOutNotificationIds([...fadeOutNotificationIds, id]);
    setTimeout(() => {
      const updatedHidden = [...hiddenNotificationIds, id];
      setHiddenNotificationIds(updatedHidden);
      saveDataInLocalStorage(
        LOCALSTORAGES.HIDDEN_NOTIFICATION_IDS,
        updatedHidden
      );
      setFadeOutNotificationIds(
        fadeOutNotificationIds.filter((notificationId) => notificationId !== id)
      );
    }, 500);
  };

  return (
    <div
      className={classNames(styles.container, "am-gapY-16px")}
      style={{
        marginTop: !isLoading && notifications.length === 0 ? "-16px" : "0px",
      }}
    >
      {notifications
        .filter(
          (notification) => !hiddenNotificationIds.includes(notification.id)
        )
        .map((notification, _idx) => (
          <Notification
            notification={notification}
            onClickHide={onClickHideNotification}
            fadeOutNotificationIds={fadeOutNotificationIds}
            key={_idx}
          />
        ))}
    </div>
  );
};

export default Notifications;
