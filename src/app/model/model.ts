// Define interfaces to represent the JSON structure

export interface Plugin {
    title: string;
    description: string;
  }
  
  export interface TabData {
    title: string;
    icon: string;
    active: string[];
    disabled: string[];
    inactive: string[];
  }
  
  export interface Data {
    tabs: string[];
    tabdata: { [key: string]: TabData };
    plugins: { [key: string]: Plugin };
  }
  
  export interface Tabs {
    name: string;
    title: string;
    icon: string;
  }
  
  export interface AllPlugins {
    [key: string]: TabData;
  }
  