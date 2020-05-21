import React from 'react'
import { graphql } from 'babel-plugin-relay/macro'
import { useLazyLoadQuery } from 'react-relay/hooks'
import { ProfileQuery } from './__generated__/ProfileQuery.graphql'

const Profile = () => {
  const { me } = useLazyLoadQuery<ProfileQuery>(
    graphql`
      query ProfileQuery {
        me {
          name
          email
          avatar
        }
      }
    `,
    {}
  )

  if(!me) return <>Loading...</>

  return (
    <>
      <p>User: {me.name}</p>
      <p>Email: {me.email}</p>
      {me.avatar && me.name && <img src={me.avatar} alt={me.name} />}
    </>
  )
}
export default Profile