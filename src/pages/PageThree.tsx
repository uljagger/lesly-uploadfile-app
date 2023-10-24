import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { useParams } from 'react-router-dom';
import { GrafanaTheme2, SelectableValue, AppEvents } from '@grafana/data';
import { FieldSet, HorizontalGroup, InlineField, InlineFieldRow, Input, Select, Spinner, TextArea, useStyles2 } from '@grafana/ui';
import { INFLUX_DATABASES, FILE_TYPES, REGEX_IP } from '../constants';
import { testIds } from '../components/testIds';
import { PluginPage, getAppEvents, getBackendSrv } from '@grafana/runtime';
import Dropzone from 'react-dropzone';

// types
type State = {
  host: string;
  measurement: string;
  process: string;
  tags: string;
  bufferSize: number
};



export function PageThree() {
  const s = useStyles2(getStyles);
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dbState, setDbState] = useState<string>('rawdatas');
  const [fileTypeState, setFileTypeState] = useState<string>('csv');
  
  // console.log('GRAFANA_VERSION', process.env.GRAFANA_VERSION);
  useEffect(() => {
    updatePlugin()
  },[])

  const updatePlugin = async () => {
    const resp = await getBackendSrv().fetch({
      url: `/api/plugins/lesly-uploadfile-app/resources/leslyconf`
    }).toPromise()
    console.log('resp', resp); 
  }
  


  const [state, setState] = useState<State>({
    host: '',
    measurement: '',
    process: '',
    tags: '',
    bufferSize: 100,
  });


  const options = {
    multiple: false,
    accept:{
      "application/java-archive": ['.jar'],
      "application/json" : ['.json'],
      "text/csv" : ['.csv'],
      "application/vnd.ms-excel": ['.xls'],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ['.xlsx'],
      "text/plain": [".csv", ".txt"],
      "application/zip": ['.zip']
    }
  }

  // functions
async function uploadCSV(formData: FormData, state: State) {
  const appEvents = getAppEvents();

  console.log('state', state);

  setIsLoading(true);
  let reqOptions = {
    method: 'POST',
    body: formData
  }
  try {
    const response = await fetch(`http://${state.host}:9997/api/v1/upload/csv`, reqOptions)
    // const result = await response.json();
    if(response.ok) {
      console.log("Success:", response);
      setIsLoading(false);
      appEvents.publish({
        type: AppEvents.alertSuccess.name,
        payload: ["Upload Completed" + ': ' + response.status + ' (' + response.statusText + ')'],
      });
    }
  } catch (error) {
    console.error("Error:", error);
    appEvents.publish({
      type: AppEvents.alertError.name,
      payload: ["Cannot Upload file check upload settings"] 
    });
  } finally {
    setIsLoading(false);
  }
}

async function uploadJAR(formData: FormData, state: State) {
  const appEvents = getAppEvents();

  setIsLoading(true);
  let reqOptions = {
    method: 'POST',
    body: formData
  }
  try {
    let srvLeslyResp = await fetch(`http://${state.host}:9997/api/v1/upload/jar/${state.host}/stop`);
    console.log("STOP LPS : ", srvLeslyResp.ok);
    const response = await fetch(`http://${state.host}:9997/api/v1/upload/jar`, reqOptions);
    // const result = await response.json();
    if(response.ok) {
      console.log("Success:", response);
      setIsLoading(false);
      appEvents.publish({
        type: AppEvents.alertSuccess.name,
        payload: ["Upload Completed with success " + ': ' + response.status + ' (' + response.statusText + ')'],
      });

      // start lesly
      srvLeslyResp = await fetch(`http://${state.host}:9997/api/v1/upload/jar/${state.host}/start`);
      console.log("START LPS : ", srvLeslyResp.ok);
    }

  } catch (error) {
    console.error("Error:", error);
    appEvents.publish({
      type: AppEvents.alertError.name,
      payload: ["Cannot Upload file check upload settings"] 
    });
  } finally {
    setIsLoading(false);
  }
}

async function uploadModels(formData: FormData, state: State) {
  const appEvents = getAppEvents();

  setIsLoading(true);
  let reqOptions = {
    method: 'POST',
    body: formData
  }
  try {

    const srvResponse = await fetch(`http://${state.host}:9997/api/v1/upload/models`, reqOptions);
    // const result = await response.json();
    if(srvResponse.ok) {
      console.log("Success:", srvResponse);
      setIsLoading(false);
      appEvents.publish({
        type: AppEvents.alertSuccess.name,
        payload: ["Upload Models Completed with success " + ': ' + srvResponse.status + ' (' + srvResponse.statusText + ')'],
      });
    }

  } catch (error) {
    console.error("Error:", error);
    appEvents.publish({
      type: AppEvents.alertError.name,
      payload: ["Cannot Upload Models check upload settings"] 
    });
  } finally {
    setIsLoading(false);
  }
}
  

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setState({
      ...state,
      [event.target.name]: event.target.value.trim(),
    });
  };

  const onTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.value.trim(),
    });    
  };

  const onChangeInfluxDb = useCallback(
    (selectable: SelectableValue<string>) => {
      if (selectable.value !== undefined) {
        setDbState(selectable.value);
      }
    },
    []
  );

  const onChangeFileType = useCallback(
    (selectable: SelectableValue<string>) => {
      if (selectable.value !== undefined) {
        setFileTypeState(selectable.value);                
      }
    },
    []
  );


  const onDrop = useCallback((acceptedFiles: any[]) => {
    const file = acceptedFiles[0];
    console.log("file --->", file);
    let formData = new FormData();
    const appEvents = getAppEvents();

    const splitTags = state.tags.split(',').map(x => x.split(':'));
    const tags = Object.fromEntries(splitTags)

    formData.set("host", state.host);
    formData.set("database", dbState);
    formData.set("measurement", state.measurement);
    // formData.set("fileName", state.fileName);
    formData.set("process", state.process);
    formData.set("tags", JSON.stringify(tags));
    formData.set("bufferSize", String(state.bufferSize));
    formData.set("file", file);

    if(fileTypeState === "jar" && file.name.endsWith(".jar") && REGEX_IP.test(state.host)) {
      formData.set("destination", "jar");
      uploadJAR(formData, state); 
    } else if(fileTypeState === "zip" && file.name.endsWith(".zip") && REGEX_IP.test(state.host)) {
      formData.set("destination", "models");
      uploadModels(formData, state); 
    } else if(fileTypeState === "csv" && file.name.endsWith(".csv") && REGEX_IP.test(state.host) && state.measurement.length >= 2 && state.process.length >= 2 && state.tags.split(':').length >= 2) {
      formData.set("destination", "csv");
      uploadCSV(formData, state); 
    } else {
      console.log("cannot upload file check upload settings");
      appEvents.publish({
        type: AppEvents.alertError.name,
        payload: ["Cannot Upload file check upload settings (min 2 charaters for measurement, process, tags)  also check hosts ip address"] 
      });
      
    }
    
  }, [state, dbState, fileTypeState])


  return (
    <PluginPage>
      <div data-testid={testIds.pageThree.container}>
      <FieldSet label="">
        <InlineFieldRow>
          <InlineField label="Select File Type">
            <Select
              width={30}
              options={FILE_TYPES}
              value={fileTypeState}
              data-testid={testIds.pageThree.filetype}
              onChange={onChangeFileType}
            />
          </InlineField>
        </InlineFieldRow>
      </FieldSet>
      {(fileTypeState === "jar") || (fileTypeState === "zip")
        ? <>
            <FieldSet label="Upload Function or Model Settings">
              <InlineFieldRow>
                <InlineField label="Upload Host IP">
                    <Input
                      width={30}
                      name="host"
                      data-testid={testIds.pageThree.host}
                      value={state.host}
                      placeholder={`E.g.: 192.168.0.1`}
                      onChange={onChange}
                      required
                      className={s.borderInput}
                    />
                </InlineField>
              </InlineFieldRow>
              
            </FieldSet>
          </>
        : <>
              <FieldSet label="CSV FILE Settings">
                
                <HorizontalGroup >
                <InlineFieldRow>
                  <InlineField label="Upload Host IP">
                      <Input
                        width={30}
                        name="host"
                        data-testid={testIds.pageThree.host}
                        value={state.host}
                        placeholder={`E.g.: 192.168.0.1`}
                        onChange={onChange}
                        required
                        className={s.borderInput}
                      />
                  </InlineField>
                  <InlineField label="Operation Type">
                  <Select
                    width={45}
                    options={INFLUX_DATABASES}
                    value={dbState}
                    data-testid={testIds.pageThree.database}
                    onChange={onChangeInfluxDb}
                  />
                  </InlineField>
                  <InlineField label="Measurement">
                    <Input
                      width={30}
                      name="measurement"
                      data-testid={testIds.pageThree.measurement}
                      value={state.measurement}
                      placeholder={`E.g: m_1_2_3_4 or Spindle1`}
                      onChange={onChange}
                      required
                    />
                  </InlineField>
                  <InlineField label="Process">
                    <Input
                      width={30}
                      name="process"
                      data-testid={testIds.pageThree.process}
                      value={state.process}
                      placeholder={`Give process name.E.g : prechauffage`}
                      onChange={onChange}
                      required
                    />
                  </InlineField>
                  <InlineField label="Buffer Size">
                    <Input
                      min={100}
                      width={10}
                      type='number'
                      name="bufferSize"
                      data-testid={testIds.pageThree.bufferSize}
                      value={state.bufferSize}
                      onChange={onChange}
                    />
                  </InlineField>
                </InlineFieldRow>
                 <InlineFieldRow>
                  <InlineField label="Tags">
                    <TextArea
                      className={s.textArea}
                      rows={5}
                      name="tags"
                      data-testid={testIds.pageThree.tags}
                      value={state.tags}
                      placeholder={`Separate tags by commas E.g.: speed:50,current:2`}
                      onChange={onTextChange}
                      required
                    />
                  </InlineField>
                </InlineFieldRow>
               </HorizontalGroup>
              </FieldSet>
          </>
      }

      <Dropzone onDrop={onDrop} accept={options.accept} multiple={options.multiple}>
        {({getRootProps, getInputProps}) => (
          <section>
            <div {...getRootProps({className:s.dropcontainer })}>
              <input {...getInputProps()} />
              <div className={s.dragDropText}> <p>Drag n drop some files here, or click to select files</p></div>
            </div>
          </section>
        )}
      </Dropzone>
      {/* <LoadingPlaceholder text='Processing upload file'/> */}
        <br />
        <br />
        {isLoading && (
          <>
            <div className={s.loadingPage}>
              {/* <LoadingPlaceholder text={'Wait file is Uploading...'}/> */}
              <span>Wait file is Uploading...</span> <Spinner size={50}/>
            </div>
          </>
        )}
        {id && (
          <>
            <strong>ID:</strong> {id}
          </>
        )}
        {/* No ID parameter */}
        {!id && (
          <>
            {/* <strong>No id parameter is set in the URL.</strong> <br />
            Try the following link: <br />
            <Link className={s.link} to={prefixRoute(`${ROUTES.Three}/123456789`)}>
              {prefixRoute(`${ROUTES.Three}/123456789`)}
            </Link> */}
          </>
        )}
      </div>
    </PluginPage>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  link: css`
    color: ${theme.colors.text.link};
    text-decoration: underline;
  `,
  dropcontainer: css`
    max-width: 100%;
    min-height: 200px;
    border-style: dashed solid;
  `,
  dragDropText: css`
    margin: auto;
    width: 30%;
    padding: 10px;

    `,
  loadingPage: css({
    height: '100%',
    flexDrection: 'column',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  borderInput: css({
    borderColor: '#FFFFFF'
  }),
  textArea: css({
    minWidth: '600px'
  })
});
