import { useQuery } from 'react-query'
import BaseSidebar, { IComposedSidebarProps, INavItem } from '@/components/BaseSidebar'
import { useParams } from 'react-router-dom'
import React, { useEffect, useMemo } from 'react'
import { fetchModel } from '@/services/model'
import { useModel, useModelLoading } from '@/hooks/useModel'
import { useOrganization } from '@/hooks/useOrganization'
import { resourceIconMapping } from '@/consts'
import useTranslation from '@/hooks/useTranslation'
import { RiSurveyLine } from 'react-icons/ri'

export default function ModelSidebar({ style }: IComposedSidebarProps) { // eslint-disable-line
    const { orgName, modelName } = useParams<{ orgName: string; modelName: string }>()
    const modelInfo = useQuery(`fetchModel:${orgName}:${modelName}`, () => fetchModel(orgName, modelName))
    const { model, setModel } = useModel()
    const { organization, setOrganization } = useOrganization()
    const { setModelLoading } = useModelLoading()
    useEffect(() => {
        setModelLoading(modelInfo.isLoading)
        if (modelInfo.isSuccess) {
            if (modelInfo.data.uid !== model?.uid) {
                setModel(modelInfo.data)
            }
            if (modelInfo.data.organization?.uid !== organization?.uid) {
                setOrganization(modelInfo.data.organization)
            }
        } else if (modelInfo.isLoading) {
            setModel(undefined)
        }
    }, [
        model?.uid,
        modelInfo.data,
        modelInfo.isLoading,
        modelInfo.isSuccess,
        organization?.uid,
        setModel,
        setModelLoading,
        setOrganization,
    ])
    const [t] = useTranslation()

    const navItems: INavItem[] = useMemo(
        () => [
            {
                title: t('overview'),
                path: `/orgs/${orgName}/models/${modelName}`,
                icon: RiSurveyLine,
            },
            {
                title: t('sth list', [t('version')]),
                path: `/orgs/${orgName}/models/${modelName}/versions`,
                icon: resourceIconMapping.bento_version,
            },
        ],
        [modelName, orgName, t]
    )

    return <BaseSidebar title={modelName} icon={resourceIconMapping.bento} navItems={navItems} />
}