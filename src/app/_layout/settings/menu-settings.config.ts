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
      { section: 'HISTORIAL', icon: 'la-ellipsis-h' },
      {
        title: 'Cosechas',
        icon: 'la-leaf',
        page: '/harvest/harvests-view'
      },
      { section: 'GESTIÓN', icon: 'la-ellipsis-h' },
      {
        title: 'Categorías',
        icon: 'la-list-ul',
        page: '/category/categories-list'
      },
      {
        title: 'Usuarios',
        icon: 'la-user-plus',
        page: '/user/user-view'
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
      { section: 'HISTORIAL', icon: 'la-ellipsis-h' },
      {
        title: 'Cosechas',
        icon: 'la-leaf',
        page: '/harvest/harvests-view'
      },
      { section: 'GESTIÓN', icon: 'la-ellipsis-h' },
      {
        title: 'Categorías',
        icon: 'la-list-ul',
        page: '/category/categories-list'
      },
      {
        title: 'Usuarios',
        icon: 'la-user-plus',
        page: '/user/user-view'
      },
    ]
  }
};





