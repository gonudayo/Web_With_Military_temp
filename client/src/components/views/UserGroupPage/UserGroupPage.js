import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Badge, Box, Button, Card, CardActions, Container, Grid, Link, Typography } from '@mui/material';
import Axios from "axios";
import StudyGroupCard from './Sections/StudyGroupCard';
import PeopleIcon from '@mui/icons-material/People';
import { profileUser } from "../../../_actions/user_actions";

export default function UserGroupPage(props) {
    const { userId } = props.match.params;
    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(profileUser({userId : userId}))
        .then(response => {
            if (response.payload.success) {
                //console.log(response.payload);
            }
        });

    }, []);
    
    const userData = useSelector((state) => state.user);

    if (userData.userProfile === undefined) {
        return (
            <div>유저정보 불러오는 중</div>
        );
    }   else {
        const {user} = userData.userProfile;
        //console.log(userProfile);
        const myGroups = 
            <>
                { user.groupList.map((group, index) => (
                    <Grid
                        item
                        xs={3}
                        key={index}
                    >
                        <Link
                            href={`/groups/${group._id}`}
                            underline="none"
                        >
                            <StudyGroupCard group={group}/>
                        </Link>
                    </Grid>
                ))}
            </>
        return (
            <Container 
                component="main"
                maxWidth="lg"
            >
                <Box sx={{display: 'flex'}}>
                    <Avatar
                        size="large"
                        src={localStorage.getItem("image")}
                        style={{
                            fontSize: "32px",
                            position: "flex",
                        }}
                    />
                    <Typography variant="h5"
                    >
                        안녕하세요, {user.name}님!
                        공부를 시작한지 벌써 000이 지났어요
                    </Typography>
                </Box>
    
                <Box 
                    sx={{
                        backgroundColor: '#E8E8E8',
                        borderRadius: '2.5rem',
                        p: 4,
                    }}
                >
                    <Box sx={{ display: 'flex'}}>
                        <Typography
                            sx={{
                                pb: 2,
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                            }}
                        >
                            내 스터디그룹
                        </Typography>
                        <PeopleIcon sx={{
                            color: '#5E5E5E',
                            fontSize: '2rem',
                            ml: 1,
                        }}/>
                    </Box>
                    <Grid container spacing={4}>
                        <Grid item xs={3}>
                            <Card sx={{ 
                                minHeight: 400, 
                                borderRadius: '1rem',
                                display: 'flex',
                                justifyContent: 'center',
                                position: 'relative',
                                padding: 0,
                            }}>
                                <Button
                                    component="a"
                                    href="/group/create"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute',
                                    }}
                                >
                                    <Typography
                                        variant="h2"
                                        sx={{ color: '#5E5E5E', }}
                                    >
                                        +
                                    </Typography>
                                </Button>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        position: 'absolute',
                                        top: '55%',
                                        color: '#5E5E5E',
                                }}>
                                    스터디 그룹 추가
                                </Typography>
                            </Card>
                        </Grid>
                        {myGroups}
                    </Grid>
                </Box>
            </Container>
        );
    }
    
}