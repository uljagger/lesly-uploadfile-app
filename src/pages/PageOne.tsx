import React, { useEffect } from 'react';
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { LinkButton, useStyles2 } from '@grafana/ui';
import { prefixRoute } from '../utils/utils.routing';
import { ROUTES } from '../constants';
import { testIds } from '../components/testIds';
import { PluginPage, getBackendSrv } from '@grafana/runtime';

export function PageOne() {
  const s = useStyles2(getStyles);

  
  useEffect(() => {
    updatePlugin()
  },[])
  // 3. Create out useEffect function
  // useEffect(() => {
  //   fetch("https://dog.ceo/api/breeds/image/random")
  //   .then(response => response.json())
  //   // 4. Setting *dogImage* to the image url that we received from the response above
  // },[])
  // /api/plugins/lesly-uploadfile-app/resources/ping
  // /api/plugins/lesly-uploadfile-app/settings
  // /api/plugins/lesly-uploadfile-app/metrics
  const updatePlugin = async () => {
    const resp = await getBackendSrv().fetch({
      url: `/api/plugins/lesly-uploadfile-app/resources/leslyconf`
    }).toPromise()
    console.log('resp', resp);
    
    // const response = await getBackendSrv().fetch({
    //   url: `/api/plugins/${pluginId}/settings`,
    //   method: 'GET'
    // });
  }
    

  return (
    <PluginPage>
      <div data-testid={testIds.pageOne.container}>
        This is page one.
        <div className={s.marginTop}>
          <LinkButton data-testid={testIds.pageOne.navigateToFour} href={prefixRoute(ROUTES.Four)}>
            Full-width page example
          </LinkButton>
        </div>
      </div>
    </PluginPage>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  marginTop: css`
    margin-top: ${theme.spacing(2)};
  `,
});
