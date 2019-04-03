import React from "react";
import { NavBar } from "@components";

import { NavBarProfile } from "./children";

const AuthNavBar = props => {
  const { t } = props;
  const navigation = [
    {
      id: "welcome",
      icon: "img/people_white.png",
      label: "HOME",
      to: "/welcome"
    },
    {
      id: "profile",
      icon: "img/people_white.png",
      label: "PROFILE",
      to: "/profile"
    },
    {
      id: "Topology",
      icon: "img/people_white.png",
      label: "TOPOLOGY",
      to: "/topology"
    },
    {
      id: "Roles",
      icon: "img/people_white.png",
      label: "ROLES",
      to: "/roles"
    },
    {
      id: "Documents",
      icon: "img/people_white.png",
      label: "DOCUMENTS",
      to: "/documents"
    }
  ];
  return (
    <NavBar

      navigation={navigation}
      toolbar={[
        // {
        //   component: () => <LanguageDropdown {...props} />,
        //   id: "language"
        // },
        {
          component: () => <NavBarProfile {...props} />,
          id: "profile"
        }
      ]}
    />
  );
};

export default AuthNavBar;
