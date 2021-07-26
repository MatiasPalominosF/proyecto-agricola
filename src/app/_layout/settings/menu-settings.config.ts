// Default menu settings configurations

export interface MenuItem {
  title: string;
  icon: string;
  page: string;
  isExternalLink?: boolean;
  issupportExternalLink?: boolean;
  badge: { type: string, value: string };
  submenu: {
    items: Partial<MenuItem>[];
  };
  section: string;
}

export interface MenuConfig {
  horizontal_menu: {
    items: Partial<MenuItem>[]
  };
  vertical_menu: {
    items: Partial<MenuItem>[]
  };
}

export const MenuSettingsConfig: MenuConfig = {
  horizontal_menu: {
    items: [
      {
        title: 'Dashboard',
        icon: 'la-home',
        page: 'null',
        submenu: {
          items: [
            /*{
               title: 'Sales',
               page: '/dashboard/sales'
             },*/
            {
              title: 'Vista 1',
              page: '/dashboard/show-data'
            },
          ]
        }
      },
      { section: 'HISTORIAL', icon: 'la-ellipsis-h' },
      {
        title: 'Cosechas',
        icon: 'la-support',
        page: 'https://pixinvent.ticksy.com/',
        isExternalLink: true
      },
      {
        title: 'Usuarios',
        icon: 'la-text-height',
        page: 'https://modern-admin-docs.web.app/html/ltr/documentation/index.html',
        isExternalLink: true,
      },
      { section: "DISEÑO", icon: 'la-ellipsis-h' },
      {
        title: 'Orientación',
        icon: 'la-television',
        page: 'null',
        submenu: {
          items: [
            {
              title: 'Horizontal',
              page: 'null'
            },
            {
              title: 'Vertical',
              page: 'null'
            },
          ]
        }
      },
    ]
  },
  vertical_menu: {
    items: [
      {
        title: 'Dashboard',
        icon: 'la-home',
        page: '/dashboard/show-data',
        /*submenu: {
          items: [
            {
              title: 'Vista 1',
              page: '/dashboard/show-data'
            },
          ]
        }*/
      },
      { section: 'HISTORIAL', icon: 'la-ellipsis-h' },
      {
        title: 'Cosechas',
        icon: 'la-support',
        page: '/harvest/harvests-view'
      },
      {
        title: 'Usuarios',
        icon: 'la-text-height',
        page: '/dashboard/show-data'
      },
      { section: "DISEÑO", icon: 'la-ellipsis-h' },
      {
        title: 'Orientación',
        icon: 'la-television',
        page: 'null',
        submenu: {
          items: [
            {
              title: 'Horizontal',
              page: 'null'
            },
            {
              title: 'Vertical',
              page: 'null'
            },
          ]
        }
      },
    ]
  }

};





