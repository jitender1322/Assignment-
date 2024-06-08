import React from 'react'
import { Badge, Box, Button, FormControl, Icon, IconButton, InputLabel, MenuItem, NativeSelect, Select, TextField } from '@mui/material'
import { AccountCircle, ArrowDownward, ArrowDropDown, ArrowRight, Headphones, Mail, NotificationAdd, Public, Search, Whatshot, Window, } from '@mui/icons-material';

export default function Header() {
    return (
        <div>
            <nav>
                <Box className="titlebar" sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", padding: '2px 10px', border: '1px solid #d8cbcb', button: { textTransform: 'capitalize' } }} >
                    <Box>
                        <Button size='small'>About us</Button>
                        <Button size='small'>Contact us</Button>
                        <Button size='small'>My account</Button>
                        <Button size='small'>Wishlist</Button>
                    </Box>
                    <Box>
                        <p style={{ color: 'rgba(78, 73, 73, 0.737)' }}>Get great devices up to 50% off get details</p>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button endIcon={<ArrowRight />} size='small' >Need help call us </Button>
                        <NativeSelect sx={{ border: "none", fontSize: '14px' }} disableUnderline IconComponent={Public}  >
                            <option>English</option>
                            <option>Hindi</option>
                        </NativeSelect>
                    </Box>
                </Box>
                <Box className='navbar' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '85px', border: '1px solid #d8cbcb' }}>
                    <img src="logo.png" alt="" />
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid grey', borderRadius: '10px', padding: "0 10px" }}>
                        <Button endIcon={<ArrowRight />} sx={{ color: 'black' }} >All Categoris</Button>
                        <TextField label="Search" variant='standard' size='small' sx={{
                            width: '400px',
                            padding: '0px 0px 13px 0px',
                            '& .MuiInput-underline:before': {
                                borderBottom: 'none',
                            },
                            '& .MuiInput-underline:after': {
                                borderBottom: 'none',
                            },
                            '& .MuiInputBase-root': {
                                outline: 'none',
                            },
                        }} />
                        <Icon><Search /></Icon>
                    </div>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small-label">Location</InputLabel>
                        <Select label="location" >
                            <MenuItem >Ahmedabad</MenuItem>
                            <MenuItem >Rajkot</MenuItem>
                            <MenuItem >Surat</MenuItem>
                        </Select>
                    </FormControl>
                    <MenuItem>
                        <IconButton size="small" >
                            <Badge badgeContent={4} color="warning">
                                <Mail />
                            </Badge>
                        </IconButton>
                        <p style={{ color: 'grey' }} >Messages</p>
                    </MenuItem>
                    <MenuItem>
                        <IconButton size="small" >
                            <Badge badgeContent={17} color="warning">
                                <NotificationAdd />
                            </Badge>
                        </IconButton>
                        <p style={{ color: 'grey' }}>Notifications</p>
                    </MenuItem>
                    <MenuItem >
                        <IconButton
                            size="small">
                            <AccountCircle />
                        </IconButton>
                        <p style={{ color: 'grey' }} >Profile</p>
                    </MenuItem>
                </Box>
                <Box className='btnbar' sx={{ margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button variant='contained' startIcon={<Window />} endIcon={<ArrowDropDown />} >Browse All Categories</Button >
                    <Button variant='text' size='small' startIcon={<Whatshot />}>Hot Deals</Button>
                    <Button variant='text' size='small' endIcon={<ArrowDropDown />}>Home</Button>
                    <Button variant='text' size='small' endIcon={<ArrowDropDown />}>About</Button>
                    <Button variant='text' size='small' endIcon={<ArrowDropDown />}>Shop</Button>
                    <Button variant='text' size='small' endIcon={<ArrowDropDown />}>Vendors</Button>
                    <Button variant='text' size='small' endIcon={<ArrowDropDown />}>Mega menu</Button>
                    <Button variant='text' size='small' endIcon={<ArrowDropDown />}>Blog</Button>
                    <Button variant='text' size='small' endIcon={<ArrowDropDown />}>Pages</Button>
                    <Button variant='text' size='small'>Contact</Button>
                    <div className="div" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon><Headphones sx={{ color: 'blueviolet', fontSize: '25px' }} /></Icon>
                        <div className="text" style={{ color: 'blueviolet' }}>
                            <h4>1900 - 888</h4>
                            <h6>24x7 Support Center</h6>
                        </div>
                    </div>
                </Box>
            </nav>
        </div >
    )
}
