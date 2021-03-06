import { Text,  Image, Flex ,Box,  VStack, Button, HStack, Input , FormControl, Badge} from "@chakra-ui/react";
import React from "react";
import { useState, useEffect } from 'react';
import HistoryStack from '../../components/HistoryStack';
import apiClient from "../../http-common.js"
import * as FaIcons from 'react-icons/fa';
import tes1 from '../../assets/history.png';

function HistoryPage(){
  
  const initiateDNATest = {IdPengguna:"", NamaPengguna: "", Penyakit: "", Kemiripan: "", Status:"", Sekuens: "", Tanggal: ""};
  const [history, setHistory] = useState([initiateDNATest]);
  const initialValue = {search : ""};
  const [formValues, setFormValues] = useState(initialValue);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  async function getHistory(e) {
    try{
      let response;
      if(formValues.search === ""){
        response = await apiClient.get('history/get-all-tes-dna');
      } else {
        response = await apiClient.get('history/search/', {params: {value: formValues.search}});
      }
      const result = {
        status: response.status,
        headers: response.headers,
        data: response.data
      };
      console.log(result);
      setHistory(result.data);
    } catch(err){
      if (err.status === 404) {
        alert("Not found!");
      }
      setHistory([]);
      console.log(err);
    }
  }

  const handleChange = (e) => {
      const {name, value} = e.target;
      setFormValues({...formValues, [name]: value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    getHistory(e);
  };

  useEffect(() => {
    console.log(formErrors);
    if(Object.keys(formErrors).length === 0 && isSubmit) {
        console.log(formValues);
    }
  });

  const validate = (values) => {
    const errors = {};
    if (!values.search ) {
        errors.search = "Input The Keyword First!";
    }
    return errors;
  }

  return (
    console.log(history),
    <VStack p={4 }align="center" justify="center" ml = '5vw'>
      {/* <Heading
      mb='2'
      fontWeight='extrabold'
      size='2xl'
      p = '19'
      >
        HISTORY
      </Heading > */}
      <Flex align="center" justify="center"  py = '5'>
          <Box>
            <Image boxSize='100%' src={tes1} alt="logo1"/>
          </Box>
      </Flex>
      
        <VStack p = '10px'>
      <HStack >
          <FormControl isRequired>
            <Input name='search'  placeholder='Input the query here' value={formValues.search}
            onChange = {handleChange}
            maxW = '480px'
            />
          </FormControl>
        <Button marginBottom={"5vh"} colorScheme='teal' variant='solid' onClick={handleSubmit} type= 'submit'>
            <FaIcons.FaSearch size={"80%"}/>
        </Button>
      </HStack>
            <Text fontSize={"8pt"} textColor="gray"> Masukkan Waktu atau/dan Nama Penyakit (Contoh: '27 April 2022' atau 'AIDS' atau '27 April 2022 AIDS')</Text>
            <Badge colorScheme='red'>{formErrors.search}</Badge>
          </VStack>

      <Box marginLeft={"10vw"} width="100%" minWidth={"70vw"} maxWidth={"70vw"}>
        <HistoryStack history={history}/>
      </Box>
    </VStack>
  );
}

export default HistoryPage;