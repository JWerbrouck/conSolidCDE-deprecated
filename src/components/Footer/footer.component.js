import React from 'react';
import { IconLookup, IconDefinition, findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from "react-i18next";

const Footer = (props) => {

  const { t } = props;
  const githubIcon: IconLookup = { prefix: 'fab', iconName: 'github' };
  const githubIconDef: IconDefinition = findIconDefinition(githubIcon);

  return (
    <footer className='solid-footer footer'>
      <section className='solid-footer__content'>
        <div className='solid-footer__content--copyright'>
          <ul>
            {/*<li>© {process.env.REACT_APP_COMPANY_NAME}</li>*/}
            {/*<img src="/src/externalDocs/ugent.png" alt="ugent-logo"/>*/}
          </ul>
        </div>
      </section>
    </footer>
  );
};

export default withTranslation()(Footer);
