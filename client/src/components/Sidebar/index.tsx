import React from 'react'
import Search from '../Search'
import CardSidebar from '../Cards/CardSidebar'

export default function Sidebar() {
  return (
    <div className='sidebar ps-4 pt-4 pe-4'>
      <Search />
      <div className='sidebar__content mt-4 mb-4 pe-1'>
        <CardSidebar avatar={''} username={'Maksim'} message={'hi'} />
        <CardSidebar avatar={''} username={'Polina'} message={'LOL'} />
        <CardSidebar avatar={''} username={'JON'} message={'LOLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL'} />
        <CardSidebar avatar={''} username={'Polina'} message={'LOL'} />
        <CardSidebar avatar={''} username={'Polina'} message={'LOL'} />
        <CardSidebar avatar={''} username={'Polina'} message={'LOL'} />
        <CardSidebar avatar={''} username={'Polina'} message={'LOL'} />
        <CardSidebar avatar={''} username={'Polina'} message={'LOL'} />
        <CardSidebar avatar={''} username={'Polina'} message={'LOL'} />
        <CardSidebar avatar={''} username={'Polina'} message={'LOL'} />
        <CardSidebar avatar={''} username={'Polina'} message={'LOL'} />
        <CardSidebar avatar={''} username={'Polina'} message={'LOL'} />
      </div>
    </div>
  )
}
