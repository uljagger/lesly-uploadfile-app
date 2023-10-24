// import { PLUGIN_BASE_URL } from '../constants';
const Influx = require("influx");

// Prefixes the route with the base URL of the plugin
export function writePoints(ip: string, db: string) {
    try {
      // Connect to a single host with a DSN:
      const influx = new Influx.InfluxDB(
        "http://admin:cyclosoft@" + ip + ":8086/" + db
      );

      influx.writePoints([
        {
          measurement: 'perf',
          tags: { host: 'box1.example.com' },
          fields: { cpu: 1.02, mem: 5 },
          timestamp: new Date(),
        }
      ], {
        database: 'my_db',
        retentionPolicy: '1d',
        precision: 's'
      })

    } catch (error) {
      console.log("error from influxdb writePoints", error);
    }
}
