import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  useDisclosure,
  Stat,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { useTable, usePagination } from 'react-table';
import { FaFolder } from 'react-icons/fa';
import Select from 'react-select';
import EditPopup from './EditPopup';
import ViewPopup from './dossierviewer';
import DeletePopup from './deleteDossier';
import RefusalPopup from './RefusalPopup';
import { format } from 'date-fns';

const customStyles = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

const FichiersDossiersContent = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [viewDossier, setViewDossier] = useState(null);
  const [state, setState] = useState('');
  const [reason, setReason] = useState('');
  const [newDate, setNewDate] = useState(new Date());
  const [showRefusalPopup, setShowRefusalPopup] = useState(false);
  const [stats, setStats] = useState({ accepted: 0, refused: 0, total: 0 });
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Aucun token trouvé');
        return;
      }

      try {
        const [dossierResponse, statsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/dossier/all', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/stat/dossier', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setData(dossierResponse.data);
        setFilteredData(dossierResponse.data.filter(el=>el.etat==="En attente"));
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données !', error);
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter((dossier) =>
        Object.values(dossier).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterOption) {
      filtered = filtered.filter((dossier) => {
        if (filterOption === 'import' || filterOption === 'export') {
          return dossier.typeDossier === filterOption;
        }
        if (filterOption === 'en-attente') {
          return dossier.etat === 'En attente';
        }
        return true;
      });
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, filterOption]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterOption('');
    setFilteredData(data);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const updateDossierStatus = async (dossierId, newStatus) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Aucun token trouvé');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/dossier/${dossierId}`,
        { etat: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const response = await axios.get('http://localhost:5000/api/dossier/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
      setFilteredData(response.data.filter(el=>el.etat==="En attente"));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut du dossier :', error);
    }
  };

  const columns = useMemo(
    () => [
      { Header: 'ID Dossier', accessor: '_id' },
      { Header: 'Type', accessor: 'typeDossier' },
      { Header: 'Date de Soumission', accessor: 'dateDeSoumission', Cell: ({ value }) => formatDate(value) },
      { Header: 'Date limite', accessor: 'dateLimite', Cell: ({ value }) => formatDate(value) },
      {
        Header: 'Etat',
        accessor: 'etat',
        Cell: ({ row }) => (
          <Select
            options={[
              { value: 'Accepté', label: 'Accepté' },
              { value: 'Refusé', label: 'Refusé' },
              { value: 'En attente', label: 'En attente' },
            ]}
            defaultValue={{ value: row.original.etat, label: row.original.etat }}
            onChange={(selectedOption) => {
              setSelectedDossier(row.original);
              if (selectedOption.value === 'Refusé') {
                setState('Refusé');
                setShowRefusalPopup(true);
              } else {
                setState(selectedOption.value);
                updateDossierStatus(row.original._id, selectedOption.value);
              }
            }}
            styles={customStyles}
            menuPortalTarget={document.body}
          />
        ),
      },
      {
        Header: 'Action',
        accessor: '',
        Cell: ({ row }) => (
          <HStack spacing={3}>
            <Icon
              as={FaFolder}
              w={5}
              h={5}
              cursor="pointer"
              color="blue.500"
              _hover={{ color: 'blue.700' }}
              onClick={() => {
                setViewDossier(row.original);
                onViewOpen();
              }}
            />
          </HStack>
        ),
      },
    ],
    [onViewOpen]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({ columns, data: filteredData }, usePagination);

  return (
    <Box p={5}>
      <Flex mb={5} gap={5} wrap="wrap">
        <StatCard icon={FaFolder} title="Dossiers Acceptés" number={stats.accepted} arrowType="increase" arrowText="16% ce mois-ci" />
        <StatCard icon={FaFolder} title="Dossiers Refusés" number={stats.refused} arrowType="decrease" arrowText="1% ce mois-ci" />
        <StatCard icon={FaFolder} title="Tous les Dossiers" number={stats.total} />
      </Flex>

      <Box bg="white" p={5} borderRadius="md" shadow="md">
        <Flex mb={5} justify="space-between" align="center">
          <VStack align="start">
            <Text fontSize="2xl" fontWeight="bold">
              Tous les Dossiers et les Fichiers
            </Text>
            <Text fontSize="md" color="gray.500">
              Dossiers en attente
            </Text>
          </VStack>
          <HStack spacing={3}>
            <Input
              placeholder="Recherche"
              size="md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button paddingInline={10} colorScheme={filterOption === 'import' ? 'blue' : 'gray'} onClick={() => setFilterOption('import')}>
              Import
            </Button>
            <Button paddingInline={10} colorScheme={filterOption === 'export' ? 'blue' : 'gray'} onClick={() => setFilterOption('export')}>
              Export
            </Button>
          
            <Button paddingInline={20} colorScheme="red" onClick={resetFilters}>
              Réinitialiser
            </Button>
          </HStack>
        </Flex>

        <TableContainer>
          <Table {...getTableProps()} variant="striped" colorScheme="gray">
            <Thead>
              {headerGroups.map((headerGroup) => (
                <Tr style={{ border: '1px solid gray' }} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Th style={{ border: '1px solid gray' }} {...column.getHeaderProps()}>{column.render('Header')}</Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <Tr style={{ border: '1px solid gray' }} {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <Td style={{ border: '1px solid gray' }} {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        <Flex justify="space-between" mt={5} alignItems="center">
          <Text>Afficher des données 1 à {pageSize} sur {filteredData.length} entrées</Text>
          <HStack>
            <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </Button>
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </Button>
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} sur {pageOptions.length}
              </strong>{' '}
            </span>
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </Button>
            <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {'>>'}
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Modals */}
      {isEditOpen && <EditPopup isOpen={isEditOpen} onClose={onEditClose} dossier={selectedDossier} />}
      {isViewOpen && <ViewPopup isOpen={isViewOpen} onClose={onViewClose} dossier={viewDossier} />}
      {showRefusalPopup && (
        <RefusalPopup
          isOpen={showRefusalPopup}
          onClose={() => setShowRefusalPopup(false)}
          dossier={selectedDossier}
          reason={reason}
          newDate={newDate}
          setState={setState}
          onReasonChange={(e) => setReason(e.target.value)}
          onDateChange={(date) => setNewDate(date)}
          onSubmit={() => {
            updateDossierStatus(selectedDossier._id, 'Refusé');
            setShowRefusalPopup(false);
          }}
        />
      )}
    </Box>
  );
};

const StatCard = ({ icon, title, number, arrowType, arrowText }) => (
  <Stat p={4} bg="white" borderRadius="md" shadow="md" flex="1" minWidth="200px">
    <HStack>
      <Icon as={icon} w={8} h={8} color="blue.500" />
      <VStack align="start" spacing={1}>
        <StatNumber>{number}</StatNumber>
      
      </VStack>
      
    </HStack><Text mt={2} fontWeight="bold">
      {title}
    </Text>
    {arrowType && (
          <StatHelpText>
            <StatArrow type={arrowType} />
            {arrowText}
          </StatHelpText>
        )}
    
  </Stat>
);

export default FichiersDossiersContent;
